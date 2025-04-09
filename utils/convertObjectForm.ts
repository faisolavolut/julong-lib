export const convertFormObject = ({
  data,
  form = new FormData(),
  task,
}: {
  data: any;
  form?: FormData;
  task: ({
    keys,
    value,
    form,
  }: {
    keys: string;
    value: any;
    form: FormData;
  }) => void;
}) => {
  function processObject(obj: any, parentKey: string = "") {
    for (const [key, value] of Object.entries(obj)) {
      task({ keys: key, value, form });
    }
  }

  processObject(data);
  return form;
};
