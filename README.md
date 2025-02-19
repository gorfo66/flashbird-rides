# Flashbird rides
Flashbird is a French company that develop and distribute trackers. For more information regarding the brand, please have a look at their website [https://smtperformances.fr/](https://smtperformances.fr/). This project allow to visualize the rides that are recorded by the Flashbird tracker and provides some statistics.


This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.6.


## Development server

### Pre-requisites
Node 22+

### To start
To start a local development server, run:

```bash
npm install
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


### Create the google api bootstrap file
Create inside the public folder the following file:
`bootstrap-google-api.js` that should contain the following snippet of code

```
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: '<YOUR API KEY>',
  v: "alpha",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});
```

The file is excluded from the repository for security purpose

## Licencing
This is a completely open source project, written just for fun.