import { MaterialLayout } from "../../layouts/material-layout";

const MaterialPage = () => null;

// @ts-ignore
MaterialPage.getLayout = function getLayout(page: NextPage) {
  return <MaterialLayout hideDetails>{page}</MaterialLayout>;
};

export default MaterialPage;
