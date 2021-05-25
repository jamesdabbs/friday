# dnsmaq

Cf. https://banck.net/2018/12/using-dnsmasq-on-mac-os-for-local-development/

Create / update `/etc/resolver/dev` to

```
nameserver 127.0.0.1
```

Check with `scutil --dns` and ensure `dev` appears, then

```
brew install dnsmasq
sudo brew services start dnsmasq
echo "listen-address=127.0.0.1" >> $(brew --prefix)/etc/dnsmasq.conf
echo "address=/.dev/127.0.0.1" >> $(brew --prefix)/etc/dnsmasq.conf
sudo brew services restart dnsmasq
```

And update DNS servers if needed, e.g. https://www.macinstruct.com/tutorials/how-to-change-your-macs-dns-servers/

# ingress-nginx setup

From https://kubernetes.github.io/ingress-nginx/deploy

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v0.47.0/deploy/static/provider/cloud/deploy.yaml
```

# Verdaccio setup

```
kubectl create namespace verdaccio
kubectl apply -f ./packages/infra/vendor/verdaccio.yaml --namespace verdaccio
```

# Creating secrets

```
kubectl create namespace friday
kubectl create secret generic minutes-secret -n friday --from-env-file=./packages/minutes/.env
kubectl create secret generic schedule-secret -n friday --from-env-file=./packages/schedule/.env
kubectl create secret generic slack-secret -n friday --from-env-file=./packages/slack/.env
```
