export type TableItem = {
  id: string;
  name: string;
  email: string;
  location: string;
  flag: string;
  status: "Active" | "Inactive" | "Pending";
  balance: number;
  department: string;
  role: string;
  joinDate: string;
  performance: string;
};

export const fetchTableData = async (): Promise<TableItem[]> => {
  const res = await fetch(
    "https://res.cloudinary.com/dlzlfasou/raw/upload/users-01_fertyx.json"
  );
  const data = await res.json();
  return [...data, ...data];
}; 