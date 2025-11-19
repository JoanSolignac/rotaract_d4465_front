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
      <section className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-border-subtle">
        <header className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-text-primary">Clubes del distrito</h2>
            <p className="text-sm text-text-secondary">
              Un vistazo rápido al tamaño y ubicación de cada club.
            </p>
          </div>
          <Button
            color="light"
            className="bg-primary px-5 text-white hover:!bg-primary-dark focus:!ring-primary/40"
          >
            Agregar club
          </Button>
        </header>
        <div className="overflow-x-auto rounded-2xl border border-border-subtle">
          <Table>
            <Table.Head className="bg-bg-soft text-xs uppercase text-text-secondary">
              <Table.HeadCell>Nombre</Table.HeadCell>
              <Table.HeadCell>Ciudad</Table.HeadCell>
              <Table.HeadCell>Miembros</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {clubs.map((club) => (
                <Table.Row key={club.id} className="bg-white text-sm text-text-primary">
                  <Table.Cell className="font-semibold">{club.nombre}</Table.Cell>
                  <Table.Cell>{club.ciudad}</Table.Cell>
                  <Table.Cell>{club.miembros}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </section>
    </div>
  );
};
