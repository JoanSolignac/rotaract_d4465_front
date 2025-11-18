import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../components/ui/InputField";
import { Button } from "../../components/ui/Button";
import { AuthShell } from "../../components/shared/AuthShell";
import { parseApiError } from "../../utils/error";
import { useAuth } from "../../hooks/useAuth";
import { roleRouteMap } from "../../types/auth";

const registerSchema = z
  .object({
    nombre: z
      .string({ required_error: "El nombre es obligatorio" })
      .min(2, "Ingresa al menos 2 caracteres"),
    correo: z
      .string({ required_error: "El correo es obligatorio" })
      .email("Correo inválido"),
    ciudad: z
      .string({ required_error: "La ciudad es obligatoria" })
      .min(2, "Ingresa una ciudad válida"),
    fechaNacimiento: z
      .string({ required_error: "La fecha de nacimiento es obligatoria" })
      .refine((value) => !Number.isNaN(Date.parse(value)), {
        message: "Fecha inválida",
      })
      .refine((value) => {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) return false;
        const today = new Date();
        const adultThreshold = new Date(
          today.getFullYear() - 18,
          today.getMonth(),
          today.getDate(),
        );
        return parsed <= adultThreshold;
      }, { message: "Debes ser mayor de 18 años" }),
    contrasena: z
      .string({ required_error: "La contraseña es obligatoria" })
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Incluye al menos una mayúscula")
      .regex(/[0-9]/, "Incluye al menos un número"),
    confirmar: z.string(),
  })
  .refine((data) => data.contrasena === data.confirmar, {
    message: "Las contraseñas no coinciden",
    path: ["confirmar"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const onSubmit = async ({
    nombre,
    correo,
    contrasena,
    ciudad,
    fechaNacimiento,
  }: RegisterForm) => {
    try {
      setServerError(null);
      const user = await registerUser({
        nombre,
        correo,
        contrasena,
        ciudad,
        fechaNacimiento,
      });
      const redirectTo = roleRouteMap[user.rol] ?? "/dashboard/interesado";
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setServerError(parseApiError(error));
    }
  };

  return (
    <AuthShell
      title="Crea tu cuenta en minutos"
      subtitle="Activa tu rol dentro del distrito y accede a tableros personalizados para INTERESADO, SOCIO, PRESIDENTE o REPRESENTANTE."
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/auth/login" className="font-semibold text-primary">
            Inicia sesión
          </Link>
        </>
      }
    >
      <div>
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold text-text-primary">
            Regístrate
          </h2>
          <p className="text-sm text-text-secondary">
            Validaciones en tiempo real y retroalimentación UX-friendly.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Nombre completo"
            placeholder="Nombre y apellido"
            autoComplete="name"
            error={errors.nombre?.message}
            {...register("nombre")}
          />
          <InputField
            label="Correo institucional"
            type="email"
            placeholder="nombre@rotaract.org"
            autoComplete="email"
            error={errors.correo?.message}
            {...register("correo")}
          />
          <InputField
            label="Ciudad"
            placeholder="Ciudad principal"
            autoComplete="address-level2"
            error={errors.ciudad?.message}
            {...register("ciudad")}
          />
          <InputField
            label="Fecha de nacimiento"
            type="date"
            error={errors.fechaNacimiento?.message}
            {...register("fechaNacimiento")}
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.contrasena?.message}
            helperText="Incluye al menos 8 caracteres, una mayúscula y un número."
            {...register("contrasena")}
          />
          <InputField
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmar?.message}
            {...register("confirmar")}
          />
          {serverError && (
            <p className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
              {serverError}
            </p>
          )}
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            disabled={!isValid || isSubmitting}
          >
            Crear cuenta
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};
