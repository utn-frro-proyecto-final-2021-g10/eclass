import { MaterialLayout } from "../../layouts/material-layout";

const MaterialFolderPage = () => null;

// @ts-ignore
MaterialFolderPage.getLayout = function getLayout(page: NextPage) {
  return <MaterialLayout hideDetails>{page}</MaterialLayout>;
};

export default MaterialFolderPage;
