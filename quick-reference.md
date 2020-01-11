# Quick Reference

```bash
# Docker
docker build -t kubia .
docker run --name kubia-container -p 9191:9191 -d kubia

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
# Install your App at the K8s Cluster
kubectl run kubia --image=ualter/kubia --port=9191 --generator=run/v1
# or
kubectl run kubia --image=ualter/kubia --port=9191 --generator=run-pod/v1

# Exposing the ReplicationController as a Service (LoadBalance Type)
kubectl expose rc kubia --type=LoadBalancer --name kubia-http

# Scale ReplicationController
kubectl scale rc kubia --replicas=3

# Port Forwarding to expose access to a specific POD (testing purporses)
kubectl port-forward kubia-2lvnn 8888:9191  (curl localhost:8888)

## Kubectl Change Context (Minikube <--> Google Cloud) Where my Kubectl is pointing to?
## Check Contexts (K8s envionments to interact with the K8 API Server)
# List
kubectl config get-contexts
# Change
kubectl config use-context CONTEXT_NAME
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




