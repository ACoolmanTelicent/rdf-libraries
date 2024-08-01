import { apiFactory } from "./api/DataCatalogueFrontend";
import {
  CatalogService,
  DCATCatalog,
  DCATDataset,
  DCATDataService,
} from "./index";

const ns = "http://telicent.io/data/";

type MockDataBase = {
  id: string;
  title: string;
  description: string;
  creator: string;
  rights: string;
  published: string;
};
type MockDataDCATCatalog = {
  classType: "DCATCatalog";
} & MockDataBase;
type MockDataDCATDataService = {
  classType: "DCATDataService";
} & MockDataBase;
type MockDataDCATDataset = {
  classType: "DCATDataset";
} & MockDataBase;

type MockData =
  | MockDataDCATCatalog
  | MockDataDCATDataService
  | MockDataDCATDataset;

export const MOCK: Record<string, MockData> = {
  catalog1: {
    classType: "DCATCatalog",
    id: `${ns}catalog1`,
    title: `Catalog: Cornwall Data`,
    description: `2020 Royal Engineers’ Cornwall focused data catalog. Includes real-time IoT telemetry and historical archives for environmental and technological research.`,
    creator: `Mario Giacomelli`,
    rights: `James Hardacre`,
    published: `2020-3-12`,
  },
  catalog2: {
    classType: "DCATCatalog",
    id: `${ns}cat2`,
    title: `Catalog: Sussex Data`,
    description: `2020 Royal Engineers’ Cornwall focused data catalog. Includes real-time IoT telemetry and historical archives for environmental and technological research.`,
    creator: `Amina Okeke`,
    rights: `Erik Johansson`,
    published: `2020-3-12`,
  },
  catalog1_1: {
    classType: "DCATCatalog",
    id: `${ns}catalog1.1`,
    title: `Catalog: St Clement Wind turbine`,
    description: `Third-party data pulled from Wind Turbine register.`,
    creator: `Hans Müller`,
    rights: `Aarav Sharma`,
    published: `2019-5-3`,
  },
  catalog1_1_dataset: {
    classType: "DCATDataset",
    id: `${ns}catalog1_1_dataset`,
    title: `Dataset: Region 44`,
    description: `Turbines around Trefranc and St Clether.`,
    creator: `George Maxwell`,
    rights: `Aiman Ismail`,
    published: `2022-6-5`,
  },
  dataservice1: {
    classType: "DCATDataService",
    id: `${ns}dataservice1`,
    title: `Service: Wind Feed`,
    description: `Cornwall Wind Detector data via JSON REST API. Real-time, API-token controlled access for analysis by environmental scientists and meteorologists.`,
    creator: `Oleg Novak`,
    rights: `James Hardacre`,
    published: `2023-2-3`,
  },
  dataset1: {
    classType: "DCATDataset",
    id: `${ns}dataset1`,
    title: `Dataset: Q1 2021`,
    description: `Q1 2021 Cornwall incident reports dataset in CSV format. Heavily redacted, supporting public safety analysis and policy development.`,
    creator: `Kiki Sato`,
    rights: `Damir Sato`,
    published: `2021-4-5`,
  },
  dataset2: {
    classType: "DCATDataset",
    id: `${ns}dataset2`,
    title: `Dataset: Q2 2021`,
    description: `Q2 2021 Cornwall incident reports dataset in CSV format. Heavily redacted, supporting public safety analysis and policy development.`,
    creator: `Kiki Sato`,
    rights: `Damir Sato`,
    published: `2021-7-5`,
  },
  dataset3: {
    classType: "DCATDataset",
    id: `${ns}dataset3`,
    title: `Dataset: Q3 2021`,
    description: `Q3 2021 Cornwall incident reports dataset in CSV format. Heavily redacted, supporting public safety analysis and policy development.`,
    creator: `Kiki Sato`,
    rights: `Damir Sato`,
    published: `2022-10-5`,
  },
  dataset4: {
    classType: "DCATDataset",
    id: `${ns}dataset4`,
    title: `Dataset: Q4 2021`,
    description: `Q4 2021 Cornwall incident reports dataset in CSV format. Heavily redacted, supporting public safety analysis and policy development.`,
    creator: `Kiki Sato`,
    rights: `Wei Zhang`,
    published: `2023-2-5`,
  },
};
export const setup = async ({
  hostName = "http://localhost:3030/",
}: {
  hostName: string;
}) => {
  const catalogService = new CatalogService(
    hostName,
    "catalog",
    undefined,
    undefined,
    true
  );

  if (!(await catalogService.checkTripleStore())) {
    throw new Error("Triple store error: simple WHERE failed");
  }

  await catalogService.runUpdate(["DELETE WHERE {?s ?p ?o }"]); //clear the dataset

  const createResource = async ({
    mock,
    published,
    parent,
  }: {
    mock: MockData;
    published?: string;
    parent?: DCATCatalog;
  }): Promise<DCATCatalog | DCATDataset | DCATDataService> => {
    // DCATDataService
    let r: DCATDataService | DCATCatalog | DCATDataset;
    switch (mock.classType) {
      case "DCATCatalog":
        r = new DCATCatalog(
          catalogService,
          mock.id,
          mock.title,
          published,
          undefined
          // parent,
        );
        break;
      case "DCATDataService":
        r = new DCATDataService(
          catalogService,
          mock.id,
          mock.title,
          published,
          undefined
          // catalog1
        );
        break;
      case "DCATDataset":
        r = new DCATDataset(
          catalogService,
          mock.id,
          mock.title,
          published,
          undefined
          // catalog1
        );
        break;
      default:
        throw "no";
    }

    await Promise.all(r.workAsync);
    await r.setDescription(mock.description);
    await r.setCreator(mock.creator);
    await r.setRights(mock.rights);
    await r.setPublished(mock.published);
    await Promise.all(r.workAsync);
    if (parent?.addOwnedResource) {
      parent.addOwnedResource(r);
      await Promise.all(parent.workAsync);
    }
    return r;
  };

  // DCATCatalog #1
  const catalog1 = (await createResource({
    mock: MOCK.catalog1,
    published: "2022-01-01",
  })) as DCATCatalog;

  const catalog1_1 = (await createResource({
    mock: MOCK.catalog1_1,
    published: "2022-01-01",
    parent: catalog1,
  })) as DCATCatalog;

  await createResource({
    mock: MOCK.catalog1_1_dataset,
    parent: catalog1_1,
  });

  await createResource({
    mock: MOCK.dataservice1,
    parent: catalog1,
  });
  await createResource({
    mock: MOCK.dataset1,
    parent: catalog1,
  });
  await createResource({
    mock: MOCK.dataset2,
    parent: catalog1,
  });
  await createResource({
    mock: MOCK.dataset3,
    parent: catalog1,
  });
  await createResource({
    mock: MOCK.dataset4,
    parent: catalog1,
  });
  const catalog2 = (await createResource({
    mock: MOCK.catalog2,
  })) as DCATCatalog;

  const OwnedResources = {
    catalog1: await catalog1.getOwnedResources(),
    catalog1_1: await catalog1_1.getOwnedResources(),
    catalog2: await catalog2.getOwnedResources(),
  };
  console.log(`Owned resources`);
  console.log(`---------------`);
  console.log(`catalog1:   ${OwnedResources.catalog1.length}`);
  console.log(`catalog1_1: ${OwnedResources.catalog1_1.length}`);
  console.log(`catalog2:   ${OwnedResources.catalog2.length}`);

  return apiFactory(catalogService, MOCK);
};
