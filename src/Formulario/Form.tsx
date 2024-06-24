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
  } = useForm({
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

  const onSubmit = (valueForm: ValueForm) => {
    console.log(valueForm);
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input type="text" id="name" {...register("name")} />
          {errors.name && <p>{errors.name.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register("email")} />
          {errors.email && <p>{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" {...register("password")} />
          {errors.password && <p>{errors.password.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="bio">Bio:</label>
          <textarea id="bio" {...register("bio")} rows={3}></textarea>
          {errors.bio && <p>{errors.bio.message}</p>}
        </div>
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
