import { WordSourceType } from "@/types/dictionary";

const VerbComponent = ({ data }: { data: WordSourceType }) => {
  const wordForms = [
    { title: "Infinitiv", form: "inf aktiv" },
    { title: "Presens", form: "pres ind aktiv" },
    { title: "Preteritum", form: "pret ind aktiv" },
    { title: "Supinum", form: "sup aktiv" },
  ];
  return (
    <>
      {wordForms.map((wordForm) => (
        <p key={wordForm.title}>
          {wordForm.title}:{" "}
          {data.WordForms.find((wf) => wf.msd === wordForm.form)?.writtenForm ??
            "-"}
        </p>
      ))}
    </>
  );
};

export default VerbComponent;
