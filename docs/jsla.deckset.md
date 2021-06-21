<!--
This is a Deckset (https://www.deckset.com/) presentation,
prepared for the JavaScriptLA meetup (https://javascriptla.net/blog/exploring-kubernetes-w-james-dabbs/)

It is available at https://github.com/jamesdabbs/friday
-->

# [fit] Exploring Kubernetes
# [fit] _[James Dabbs](https://jdabbs.com)_ **@** _[JavaScriptLA](https://javascriptla.net/blog/exploring-kubernetes-w-james-dabbs/)_

---

# Outline

- Background
- Explorations with [Lens](https://k8slens.dev/)
- Iterating with [Skaffold](https://skaffold.dev/)
- Defining components with [CDK8s](https://cdk8s.io/)
- Summary, takeaways & questions

---

# Background: Me

- App dev stumbling down the infrastructure gradient
- Dabbled with infrastructure-as-code
- Frustrated by slow, flaky builds and long iterations

---

# Background: Me

- Application Infrastructure @ **[Procore](https://www.procore.com/jobs)**
- Develop dev-facing abstractions for our internal platform
- Goal: empower devs to self-serve with minimal cognitive load

^ I've learned a mix of tools and techniques that have made this world approachable. I hope to share both in this talk.

---

# [fit] How I Learned to Stop Worrying
# [fit] and **Love** Infrastructure Dev

---

# Background: Kubernetes (`k8s`)

- [Container orchestration platform](https://kubernetes.io/) from Google
- **Everything** is defined as structured YAML<sup>*</sup>
- So hot right now

^ We'll see some k8s manifests shortly.
^ One of the key things about k8s is that it is declarative - you operate entirely by reading and writing YAML files with a defined (if abstruse) schema.

---

# Hello `k8s`

[.column]

Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.14.2
        ports:
        - containerPort: 80
```

[.column]

Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: schedule
spec:
  type: ClusterIP
  ports:
    - port: 3000
      targetPort: 80
  selector:
    app: nginx
```


---

# _[Friday](https://github.com/jamesdabbs/friday)_

Manage meetings with

- A recurring Google calendar invite
- Meeting notes for each week, generated from a template and linked in the calendar invite
- A rotating scribe and emcee amongst the meeting members
- Slack reminders sent out morning-of with reminders about any pre-reading

---

# _[Friday](https://github.com/jamesdabbs/friday)_ - [NestJS](https://nestjs.com/) services

- `schedule` - HTTP service with Google calendar integration
- `minutes` - HTTP service using Confluence's API
- `slack` - listens on a Kafka topic, posts to Slack
- `meetings` - coordinating service using [Prisma](https://www.prisma.io/)

---

# _[Friday](https://github.com/jamesdabbs/friday)_ - Goal

Add a health check to `minutes`,
similar to the one in `meetings`

---

# [fit] _[Lens](https://k8slens.dev/)_
# [fit]
# [fit] **&** an exploration of Kubernetes

^ Live demo through
^ - Namespaces
^ - Cluster ingress
^ - Strimzi Kafka operator
^ - Application deployed in the Friday namespace
^ - Explore Services => Deployments => Pods
^ - Look at manifests for each
^ - Kafka?

---

# [Lens](https://k8slens.dev/)

- GUI for Kubernetes
- Great for exploring your cluster or `k8s` broadly
- Helpful for debugging `k8s` applications

---

# [fit] _[Skaffold](https://skaffold.dev/)_
# [fit]
# [fit] **&** making changes

^ Live demo through
^ - skaffold dev
^ - skaffold.yaml file
^   - sync definitions
^   - infra.k8s.yaml
^ - curl meetings.localhost
^   - trace ingress => service => deployment => image entrypoint => npm run start:dev
^ - make update in meetings/application.controller

---

# App Dev Loop

- Make change
- `skaffold` syncs files to container
- Webpack HMR picks up changes

TTL: Fast™ (<5s)

---

# Library Dev Loop

- Make change and bump version
- `npm run publish`
- Update version in consumer and save
- `skaffold` rebuilds image, installing new version

TTL: Could Be Better (~75s)

^ *_But_ is this something you need to optimize?
^ My normal flow here is to TDD library work with `jest --watchAll`
^ until it's ready for an `-rc#` version

---

# [Skaffold](https://skaffold.dev/)

- Quickly sync code and manifest changes to a `k8s` cluster
- More than just `skaffold dev`
- Supports different [profiles](https://skaffold.dev/docs/environment/profiles/)

^ Note that all of the example code here is optimized for application development
^ - `Dockerfile`s include dev dependencies and run `start:dev` to watch for file changes
^ - `Dockerfiles` install libraries from a (private) NPM repo
^ Could define other profiles for e.g. building `prod`-suitable images or for faster iteration on libraries

---

# [fit] _[CDK8s](https://cdk8s.io/)_
# [fit]
# [fit] **&** defining `k8s` components

^ Explore
^ - main chart, subcharts, generated submanifests & full manifest
^ - note that we can import custom resource definitions like for the Kafka operator
^ - example: refactor to add a health check to schedule sim. meetings

---

# Component Dev Loop

- Make change
- `start:dev` typechecks and renders manifest
- `skaffold dev` deploys it

TTL: Not Bad (~30s)<sup>*</sup>

^ *Depending wildly on the nature of the change for the deploy to stabilize
^ Almost all time is spent in the k8s deploy rollout

---

# [CDK8s](https://cdk8s.io/)

- Bring your usual tools to bear to encapsulate, reuse, and verify logic
- TypeScript standard autocomplete, hinting, and typechecking
- Share business logic (e.g. naming conventions) between app and infra layers

---

# [CDK8s](https://cdk8s.io/)

See also

- Python and Java implementations of CDK8s
- [CDKTF](https://learn.hashicorp.com/tutorials/terraform/cdktf) for Terraform

---

# Recap **&** Takeaways

Some tools

- [Lens](https://k8slens.dev/)
- [Skaffold](https://skaffold.dev/)
- [CDK8s](https://cdk8s.io/)

---


# Recap **&** Takeaways

Tools which improve discoverability are key, especially as you're building your mental map

---

# Recap **&** Takeaways

- Optimize your [feedback loops](https://leaddev.com/productivity-eng-velocity/optimizing-micro-feedback-loops-engineering) early and often
- Faster feedback = faster learning

---

# [fit] Questions?

---

# [fit] Exploring Kubernetes
# [fit] _[James Dabbs](https://jdabbs.com)_ **@** _[JavaScriptLA](https://javascriptla.net/blog/exploring-kubernetes-w-james-dabbs/)_
