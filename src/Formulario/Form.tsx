import { useForm } from "react-hook-form";
import "./Form.css";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface ValueForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio: string;
  gender: string;
  checkboxTerms: boolean;
}

const FORM_FIELDS = [
  { label: "Name", id: "name", type: "text" },
  { label: "Email", id: "email", type: "email" },
  { label: "Password", id: "password", type: "password" },
  { label: "Confirm Password", id: "confirmPassword", type: "password" },
  { label: "Bio", id: "bio", type: "textarea", rows: 3 },
];

const onSubmit = (valueForm: ValueForm) => {
  console.log(valueForm);
};

const schema = z
  .object({
    name: z.string().min(6, "Por favor, informe um nome válido!"),
    email: z.string().email("Por favor, informe um email válido!"),
    password: z.string().min(6, "Por favor, informe uma senha válida!"),
    confirmPassword: z
      .string()
      .min(6, "Por favor, informe uma senha de confirmação válida!"),
    bio: z.string().min(6, "Por favor, informe uma bio válida!"),
    gender: z.enum(["male", "female", "other"]),
    checkboxTerms: z.boolean().refine((value) => value === true, {
      message: "Você deve aceitar os termos e condições!",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "As senhas não são iguais!",
    path: ["confirmPassword"],
  });

const Form = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ValueForm>({
    mode: "all",
    criteriaMode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      bio: "",
      gender: "other",
      checkboxTerms: false,
    },
  });

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        {FORM_FIELDS.map((field) => (
          <div className="form-group" key={field.id}>
            <label htmlFor={field.id}>{field.label}:</label>
            {field.type === "textarea" ? (
              <textarea
                id={field.id}
                {...register(field.id as keyof ValueForm)}
                rows={field.rows || 3}
              ></textarea>
            ) : (
              <input
                type={field.type}
                id={field.id}
                {...register(field.id as keyof ValueForm)}
              />
            )}
            {errors[field.id as keyof ValueForm] && (
              <p>{errors[field.id as keyof ValueForm]?.message}</p>
            )}
          </div>
        ))}
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" {...register("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p>{errors.gender.message}</p>}
        </div>
        <div className="form-group">
          <label>
            <input type="checkbox" {...register("checkboxTerms")} /> I agree to
            the terms and conditions
          </label>
          {errors.checkboxTerms && <p>{errors.checkboxTerms.message}</p>}
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Form;
