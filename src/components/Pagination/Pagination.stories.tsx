import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";
import { responsiveStory } from "../../stories/responsiveStory";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    page: 1,
    pageSize: 25,
    total: 0,
    onPageChange: () => {},
  },
  argTypes: {
    onPageChange: { control: false },
    onPageSizeChange: { control: false },
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination page={page} pageSize={25} total={248} onPageChange={setPage} />
    );
  },
};

export const WithPageSize: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(25);
    return (
      <Pagination
        page={page}
        pageSize={pageSize}
        total={1240}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    );
  },
};

export const FewPages: Story = {
  render: () => {
    const [page, setPage] = useState(2);
    return (
      <Pagination page={page} pageSize={10} total={38} onPageChange={setPage} />
    );
  },
};

export const ManyPages: Story = {
  render: () => {
    const [page, setPage] = useState(12);
    return (
      <Pagination page={page} pageSize={20} total={4000} onPageChange={setPage} siblingCount={2} />
    );
  },
};

export const Empty: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <Pagination page={page} pageSize={25} total={0} onPageChange={setPage} />
    );
  },
};

/** Móvil: 50 páginas con la página actual en el medio. */
const movilStory: Story = {
  render: () => {
    const [page, setPage] = useState(25);
    return (
      <main>
        <Pagination page={page} pageSize={20} total={1000} onPageChange={setPage} />
      </main>
    );
  },
};

export const Mobile: Story = responsiveStory("mobile", movilStory);

/** Móvil con la página actual al inicio. */
const movilInicioStory: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return (
      <main>
        <Pagination page={page} pageSize={20} total={1000} onPageChange={setPage} />
      </main>
    );
  },
};

export const MobileInicio: Story = responsiveStory("mobile", movilInicioStory);

/** Móvil con la página actual al final. */
const movilFinalStory: Story = {
  render: () => {
    const [page, setPage] = useState(50);
    return (
      <main>
        <Pagination page={page} pageSize={20} total={1000} onPageChange={setPage} />
      </main>
    );
  },
};

export const MobileFinal: Story = responsiveStory("mobile", movilFinalStory);