
const NewsByIdPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <div>NewsByIdPage {id}</div>;
};

export default NewsByIdPage