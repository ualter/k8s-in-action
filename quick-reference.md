# Quick Reference

```bash
# Docker
docker build -t kubia .
docker run --name kubia-container -p 9191:9191 -d kubia
docker tag kubia ualter/kubia
docker push ualter/kubia

# Check (in case docker push failed)
docker-machine ssh
sudo vi /etc/resolv.conf --> it should be:
namespace 8.8.8.8

# Alias
alias k=kubectl $1 $2 $3 $4 $5 $6 $7
```

## Google Cloud Platform - Google Kubernetes Engine (GKE)
```bash
# Prepare Environment
# My Account Google (365 Dias Free Trial)
https://console.cloud.google.com/billing/01E471-04A63E-0148EE
# Login
gcloud auth login
# List Projects
gcloud projects list
# Set Project (see projects/create https://console.developers.google.com/apis)
# Enable Compute Engine API for the project at https://console.developers.google.com/apis/api/compute.googleapis.com/overview?project=524073438676
# -------------------------------------------------------------------
# Set default project
gcloud config set project kubia-264618
# List regions
gcloud compute regions list
# List zones
gcloud compute zones list
# Set default region
gcloud config set compute/region europe-north1
# Set default zone
gcloud config set compute/zone europe-north1-a
# Enter ssh Node of K8s cluster
gcloud compute ssh <node-name>
# -------------------------------------------------------------------

# Configure KubeCtl (Accordingly with GCloud)
gcloud container clusters get-credentials kubia --zone europe-north1-a --project kubia-264618

# Create the Kubernetes Cluster
# Configure kubectl command line access by running the following command:
gcloud container clusters create kubia --num-nodes 3 --machine-type f1-micro
```
## Kubernetes
### Kubectl 
```bash
# Configuring Kubectl Editor (change the default)
export KUBE_EDITOR=/user/bin/nano

# Install your App at the K8s Cluster
kubectl run kubia --image=ualter/kubia --port=9191 --generator=run/v1
# or
kubectl run kubia --image=ualter/kubia --port=9191 --generator=run-pod/v1

# Exposing the ReplicationController as a Service (LoadBalance Type)
kubectl expose rc kubia --type=LoadBalancer --name kubia-http

# Scale ReplicationController
kubectl scale rc kubia --replicas=3

# Delete ReplicationController without delete its created Pods (let's them running)
kubectl delete rc kubia-healthy --cascade=false

# Port Forwarding to expose access to a specific POD (testing purporses)
kubectl port-forward kubia-2lvnn 8888:9191  (curl localhost:8888)

# Explain content/metadata resource/object of K8s
kubectl explain deploy
kubectl explain deploy.spec.template
kubectl explain deploy.spec.template.spec.containers.livenessProbe
kubectl explain pod
kubectl explain pod.spec

# Get events
kubectl get events
kubectl get events --sort-by=.metadata.creationTimestamp
# Events of a specific object, a Pod (its name)
kubectl get events --namespace default --field-selector involvedObject.name=kubia-unhealthy-v1-948865fb6-qxq5m

# Delete filtering by Label
kubectl delete po -l app=kubia-unhealthy

# Listing Pods showing a Label's app column
 kubectl get po -L app

# Add Label to a Node of the K8's Cluster
kubeclt label node gke-kubia-default-pool-aa0814b9-kb75 disk=ssd --overwrite
# List all Nodes of the K8's Cluster
kubectl get nodes
# List all Nodes of the K8's Cluster (show column with label disk)
kubectl get nodes -L disk

## Kubectl Change Context (Minikube <--> Google Cloud) Where my Kubectl is pointing to?
## Check Contexts (K8s envionments to interact with the K8 API Server)
# List
kubectl config get-contexts
# Change
kubectl config use-context CONTEXT_NAME

# Execute a Service by its ClusterIP (not externally seen)
kubectl exec <PODS-NAME> -- curl -s <SERVICE-CLUSTER-IP>
kubectl exec kubia-manual -- curl -s 10.78.15.153

# Using JSONPath to list the External IPs of the Node's Cluster
## This works OK on GitBash, on Cmder must put inside a ShellScript file and call it with sh file.sh
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="ExternalIP")].address}'

```
### Dashboard UI
```bash
# Install Dashboard 
# (In case it is not yet install, like in the GKE environment, minikube it comes with it)
# (recommendation: https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#deploying-the-dashboard-ui)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0-beta8/aio/deploy/recommended.yaml

# The Dashboard is protected, we're gonna need a Bearer Token (creating, user, roles, access, etc.)
# Create a Service Account
kubectl apply -f k8s-dashboard-ui/service-account.yaml
# Create the ClusterRoleBinding
kubectl apply -f k8s-dashboard-ui/cluster-rolebinding.yaml
# Now, grab the Token
kubectl -n kubernetes-dashboard describe secret $(kubectl -n kubernetes-dashboard get secret | grep admin-user | awk '{print $1}')

```

### NGINX Ingress Controller
```bash
# In order to work the Ingress for Services (expose them out of cluster), 
# we need to choose and install a specific Ingress Controller before
# Here we install the NGINX Ingress Controler

# Install The Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/nginx-0.28.0/deploy/static/mandatory.yaml

# Check installation
kubectl get pods --all-namespaces -l app.kubernetes.io/name=ingress-nginx --watch

# Enable it
minikube addons enable ingress

# Now, create the Ingress
k apply -f ingress-nginx-svc-kubia.yaml

# Verify the IP for the exposed Service 
k get ing
------------------------------------------------------
NAME            HOSTS   ADDRESS          PORTS   AGE
kubia-ingress   *       192.168.99.107   80      3m12s


```

### OpenSSL (Ingress SSL Termination - Certificates)
```bash
# Private Key
openssl genrsa -out tls.key 2048

# Certificate
openssl req -new -x509 -key tls.key -out tls.cert -days 360 -subj /CN=kubia.example.com

# Secret at K8's
kubectl create secret tls tls-secret --cert=tls.cert --key=tls.key 

```
