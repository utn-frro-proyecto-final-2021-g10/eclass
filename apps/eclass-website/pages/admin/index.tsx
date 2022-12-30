import { AdminLayout } from "../../layouts/admin-layout";

const AdminPage = () => null;

// @ts-ignore
AdminPage.getLayout = function getLayout(page: NextPage) {
  return <AdminLayout hideDetails>{page}</AdminLayout>;
};

export default AdminPage;
