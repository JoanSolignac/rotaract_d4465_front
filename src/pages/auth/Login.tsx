import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { InputField } from "../../components/ui/InputField";
import { Button } from "../../components/ui/Button";
import { AuthShell } from "../../components/shared/AuthShell";
import { useAuth } from "../../hooks/useAuth";
import { roleRouteMap } from "../../types/auth";
import { parseApiError } from "../../utils/error";

const loginSchema = z.object({
  correo: z.string({ required_error: "El correo es obligatorio" }).email("Correo inválido"),
  contrasena: z
    .string({ required_error: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  const onSubmit = async (values: LoginForm) => {
    try {
      setServerError(null);
      const authedUser = await login(values.correo, values.contrasena);
      const target = roleRouteMap[authedUser.rol] ?? "/dashboard/interesado";
      // Debug logs to help diagnose navigation issues post-login
      console.debug("[Login] Usuario autenticado", authedUser);
      console.debug("[Login] Rol normalizado", authedUser.rol);
      console.debug("[Login] Navegando a", target);
      navigate(target, { replace: true });
    } catch (error) {
      setServerError(parseApiError(error));
      console.error("[Login] Error de autenticación", error);
    }
  };

  return (
    <AuthShell
      title="Bienvenido al ecosistema Rotaract D4465"
      subtitle="Gestiona tu experiencia desde una interfaz moderna basada en Material Design e IHM."
      footer={
        <>
          ¿Aún no tienes una cuenta?{" "}
          <Link to="/auth/register" className="font-semibold text-primary">
            Regístrate aquí
          </Link>
        </>
      }
    >
      <div>
        <div className="mb-8 space-y-2">
          <h2 className="text-2xl font-semibold text-text-primary">
            Accede a tu panel
          </h2>
          <p className="text-sm text-text-secondary">
            Autenticación segura con redirección inteligente según rol.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <InputField
            label="Correo institucional"
            type="email"
            placeholder="nombre@rotaract.org"
            autoComplete="email"
            error={errors.correo?.message}
            {...register("correo")}
          />
          <InputField
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.contrasena?.message}
            {...register("contrasena")}
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
            Ingresar
          </Button>
        </form>
      </div>
    </AuthShell>
  );
};
