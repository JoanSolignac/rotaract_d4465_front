import { useEffect, useState } from "react";
import { Button, Table } from "flowbite-react";
import { useAuth } from "../../hooks/useAuth";
import { WelcomePanel } from "./components/WelcomePanel";

type Club = {
  id: number;
  nombre: string;
  ciudad: string;
  miembros: number;
};

const mockClubs: Club[] = [
  { id: 1, nombre: "Rotaract Lima", ciudad: "Lima", miembros: 42 },
  { id: 2, nombre: "Rotaract Cusco", ciudad: "Cusco", miembros: 28 },
  { id: 3, nombre: "Rotaract Arequipa", ciudad: "Arequipa", miembros: 31 },
  { id: 4, nombre: "Rotaract Trujillo", ciudad: "Trujillo", miembros: 22 },
];

export const Representante = () => {
  const { user } = useAuth();
  const name = user?.nombre ?? user?.correo ?? "Representante";
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    setClubs(mockClubs);
  }, []);

  return (
    <div className="space-y-6">
      <WelcomePanel
        greeting={`Bienvenido, ${name}`}
        roleLabel="Representante distrital"
        description="Centraliza la gestión de clubes del distrito y lleva un control de su actividad."
        hint="En las siguientes iteraciones podrás crear y editar clubes desde este módulo."
      />
      <section className="glass-card relative overflow-hidden p-6 text-white">
        <div className="liquid-blob -left-12 top-6 h-48 w-48 bg-rotaract-pink/35" />
        <div className="liquid-blob right-0 bottom-0 h-40 w-40 bg-amber-200/25" />
        <div className="relative">
          <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="glass-chip text-[0.65rem] text-rose-50">Clubes</p>
              <h2 className="text-2xl font-bold leading-tight drop-shadow-lg">Clubes del distrito</h2>
              <p className="text-sm text-rose-50/70">
                Un vistazo rápido al tamaño y ubicación de cada club.
              </p>
            </div>
            <Button
              color="light"
              className="bg-gradient-to-r from-rotaract-pink to-purple-500 px-5 text-white shadow-strong hover:brightness-110 focus:!ring-primary/40"
            >
              Agregar club
            </Button>
          </header>
          <div className="overflow-x-auto rounded-2xl border border-white/15 bg-white/5">
            <Table className="text-rose-50">
              <Table.Head className="bg-white/10 text-xs uppercase text-rose-50/70">
                <Table.HeadCell className="text-rose-50">Nombre</Table.HeadCell>
                <Table.HeadCell className="text-rose-50">Ciudad</Table.HeadCell>
                <Table.HeadCell className="text-rose-50">Miembros</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y divide-white/10">
                {clubs.map((club) => (
                  <Table.Row key={club.id} className="bg-transparent text-sm text-rose-50">
                    <Table.Cell className="font-semibold text-white">{club.nombre}</Table.Cell>
                    <Table.Cell className="text-rose-50/80">{club.ciudad}</Table.Cell>
                    <Table.Cell className="text-rose-50/80">{club.miembros}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>
      </section>
    </div>
  );
};
