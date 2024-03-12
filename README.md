# rdf-libraries

Simple client-side library exported as a JavaScript package, for working with ontologies.

This is a monorepo, which contains sub-packages:
* [packages/OntologyService/README.md](packages/OntologyService/README.md)
* [packages/RdfService/README.md](packages/RdfService/README.md)

## Install

This monorepo's sub-packages are published to https://www.npmjs.com/org/telicent-oss:

```sh
yarn install @telicent-oss/ontologyservice
```

## Usage

A simple example:
```tsx
import OntologyService from "@telicent-oss/ontologyservice";

const ontologyService = new OntologyService("http://localhost:3030/", "ontology");

const diagrams = await ontologyService.getAllDiagrams();
```

For more info, see [API section](README.md#API).


## Local development

Install all dependencies for all packages and the root workspace:
```
cd <monorepoRoot>;
pnpm install; # IMPORTANT: yarn & npm may cause downstream problems during development
```
Execute task (see `nx.json`) on package:

```sh
# show any packages that are affected upstream.
# E.g. if rdfservice is modified it could affect ontologyservice
# because ontologyservice uses rdfservice as a dependency
npx nx affected:build 

# Test all upstream packages that have been affected by changes
npx nx affected:test

# Generate documentation for all affected packages
npx nx affected:generate-docs

# For more commands see [the nx documentation](https://nx.dev/getting-started/intro)
```

Execute task (see `nx.json`) on affected packages:
```sh
# Build the rdfservice package only
npx nx @telicent-oss/rdfservice:build

# Test the ontologyservice package only
npx nx @telicent-oss/ontologyservice:test
# For more commands see [the nx documentation](https://nx.dev/getting-started/intro)
```

Add dependency to package: 
```sh
pnpm add <npm-package> --filter @telicent-oss/<packageName>
```

Run command (See `packages.json` "scripts" field) on package: 
```sh
npx nx run @telicent-oss/rdfservice:format
npx nx test @telicent-oss/ontologyservice --watch -t setStyles # flags work
```

To develop multiple packages:
```sh
# In producer package...
cd ./packages/RdfService;
# ...edit producer feature
echo "console.log('hi');" >> ./src/index.ts;
# In consumer package...
cd - && cd ./packages/OntologyService;
# ...edit consumer test
echo "test('hi', () => expect(logSpy).toHaveBeenCalledWith('hi'));" >> ./src/index.test.ts; 
# Build affected
npx nx affected:build 
# Test affected
npx nx affected:test 
```
Build all packages simultaneously:
```sh
npx nx run-many -t build
```

## Developer notes

- WARNING: `import x from '.'` can cause problems. Instead use `import x from './index'`
- If changing code then all commands must be run via nx else it will use the old code in `node_modules`
- nx commands can be run from any sub-directory and will resolve as if run on monorepo root
- More nx documentation at: https://nx.dev/ai-chat

## API

See here for generated API docs:
* [Ontology Service API docs](https://telicent-oss.github.io/rdf-libraries/ontology-service/docs/)
* [RDF Service API docs](https://telicent-oss.github.io/rdf-libraries/rdf-service/docs/)

