type Props = {
  params: Promise<{
    id: string;
  }>;
}


export default async function ProblemPage({ params }: Props) {
  const { id } = await params;

  return (
    <div>
      ID: {id}
    </div>
  );
}