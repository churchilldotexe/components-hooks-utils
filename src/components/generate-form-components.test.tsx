import { describe, expect, it } from "vitest";
import { GenerateFormComponents } from "./generate-form-component";
import userEvent from "@testing-library/user-event";
import { z } from "zod";
import { fireEvent, render, screen } from "@testing-library/react";

describe.skip(GenerateFormComponents.name, () => {
  const testSchema = z.object({
    name: z.string().min(3, { message: "Name must be atleast 3 characters" }),
    email: z.string().email("invalid email address"),
    age: z.coerce.number().min(18, { message: "age must be atleast 18 years old" }),
    bio: z.string().max(100, "Bio must be must not exceed 100 characters"),
    avatar: z
      .instanceof(File)
      .refine((image) => image.size > 0, { message: "Image is required" })
      .refine((image) => image.type.startsWith("image/"), { message: "Must be an image" }),
  });

  const { Form, Input, Textarea, ErrorMessage } = GenerateFormComponents({ schema: testSchema });

  function renderUnderTest() {
    const view = render(
      <Form data-testid="test-form">
        <Input name="name" type="text" data-testid="test-name" />
        <ErrorMessage name="name" data-testid="name-error" />
        <Input name="email" type="email" data-testid="test-email" />
        <ErrorMessage name="email" data-testid="email-error" />
        <Input name="age" type="number" data-testid="test-age" />
        <ErrorMessage name="age" data-testid="age-error" />
        <Textarea name="bio" data-testid="test-bio" />
        <ErrorMessage name="bio" data-testid="bio-error" />
        <Input name="avatar" type="file" data-testid="test-file" />
        <ErrorMessage name="avatar" data-testid="file-error" />
      </Form>
    );

    const elements = {
      getForm: () => screen.getByTestId("test-form"),
      queryForm: () => screen.queryByTestId("test-form"),
      getNameInput: () => screen.getByTestId("test-name"),
      queryNameInput: () => screen.queryByTestId("test-name"),
      getNameErr: () => screen.getByTestId("name-error"),
      queryNameErr: () => screen.queryByTestId("name-error"),
      getEmailInput: () => screen.getByTestId("test-email"),
      queryEmailInput: () => screen.queryByTestId("test-email"),
      getEmailErr: () => screen.getByTestId("email-error"),
      queryEmailErr: () => screen.queryByTestId("email-error"),
      getAgeInput: () => screen.getByTestId("test-age"),
      queryAgeInput: () => screen.queryByTestId("test-age"),
      getAgeErr: () => screen.getByTestId("age-error"),
      queryAgeErr: () => screen.queryByTestId("age-error"),
      getBioTextArea: () => screen.getByTestId("test-bio"),
      queryBioTextArea: () => screen.queryByTestId("test-bio"),
      getBioErr: () => screen.getByTestId("bio-error"),
      queryBioErr: () => screen.queryByTestId("bio-error"),
      getFileInput: () => screen.getByTestId("test-file"),
      queryFileInput: () => screen.queryByTestId("test-file"),
      getFileErr: () => screen.getByTestId("file-error"),
      queryFileErr: () => screen.queryByTestId("file-error"),
    };

    return { elements, ...view };
  }

  it("should render Form elements and its inputs correctly", () => {
    const { elements } = renderUnderTest();

    expect(elements.getForm()).toBeInTheDocument();
    expect(elements.getNameInput()).toBeInTheDocument();
    expect(elements.getEmailInput()).toBeInTheDocument();
    expect(elements.getAgeInput()).toBeInTheDocument();
    expect(elements.getBioTextArea()).toBeInTheDocument();
    expect(elements.getFileInput()).toBeInTheDocument();
  });

  describe("Name Input", () => {
    it("should not show ErrorMessage Component for valid name Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getNameInput(), "ABC");
      fireEvent.blur(elements.getNameInput());

      expect(elements.queryNameErr()).not.toBeInTheDocument();
    });

    it("should show ErrorMessage Component for invalid name Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getNameInput(), "AB");
      fireEvent.blur(elements.getNameInput());

      expect(elements.getNameErr()).toHaveTextContent("Name must be atleast 3 characters");
    });

    it("should remove the ErrorMessage Component after correcting the invalid name Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getNameInput(), "AB");
      fireEvent.blur(elements.getNameInput());
      expect(elements.getNameErr()).toHaveTextContent("Name must be atleast 3 characters");

      await userEvent.type(elements.getNameInput(), "ABC");
      fireEvent.blur(elements.getNameInput());
      expect(elements.queryFileErr()).not.toBeInTheDocument();
    });
  });

  describe("Email Input", () => {
    it("should not show ErrorMessage Component for valid email Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getEmailInput(), "valid@email.com");
      fireEvent.blur(elements.getEmailInput());

      expect(elements.queryEmailErr()).not.toBeInTheDocument();
    });

    it("should show ErrorMessage Component for Invalid email Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getEmailInput(), "invalid-email");
      fireEvent.blur(elements.getEmailInput());

      expect(elements.getEmailErr()).toHaveTextContent("invalid email address");
    });

    it("should remove the ErrorMessage Component after correcting the invalid email input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getEmailInput(), "invalid-email");
      fireEvent.blur(elements.getEmailInput());
      expect(elements.getEmailErr()).toHaveTextContent("invalid email address");

      await userEvent.type(elements.getEmailInput(), "valid@email.com");
      fireEvent.blur(elements.getEmailInput());
      expect(elements.queryEmailErr()).not.toBeInTheDocument();
    });
  });

  describe("Age Input", () => {
    it("should not show ErrorMessage Component for valid age Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getAgeInput(), "18");
      fireEvent.blur(elements.getAgeInput());

      expect(elements.queryAgeErr()).not.toBeInTheDocument();
    });

    it("should show ErrorMessage Component for Invalid age Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getAgeInput(), "17");
      fireEvent.blur(elements.getAgeInput());

      expect(elements.getAgeErr()).toHaveTextContent("age must be atleast 18 years old");
    });

    it("should remove the ErrorMessage Component after correcting the valid age Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.type(elements.getAgeInput(), "17");
      fireEvent.blur(elements.getAgeInput());
      expect(elements.getAgeErr()).toHaveTextContent("age must be atleast 18 years old");

      await userEvent.type(elements.getAgeInput(), "18");
      fireEvent.blur(elements.getAgeInput());
      expect(elements.queryAgeErr()).not.toBeInTheDocument();
    });
  });

  describe("Bio TextArea", () => {
    it("should not show ErrorMessage Component for valid Bio Input", async () => {
      const { elements } = renderUnderTest();
      await userEvent.type(
        elements.getBioTextArea(),
        " Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo, similique. "
      );
      fireEvent.blur(elements.getBioTextArea());

      expect(elements.queryBioErr()).not.toBeInTheDocument();
    });

    it("should show ErrorMessage Component for invalid Bio Input", async () => {
      const { elements } = renderUnderTest();
      await userEvent.type(
        elements.getBioTextArea(),
        " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit repellat, eligendi maxime nam sapiente nemo accusantium illo qui iure. Deserunt, aut illo. Quae nesciunt repellat distinctio adipisci amet voluptatem aliquam, assumenda autem itaque! Ad, consequatur excepturi? Id possimus fugiat mollitia repudiandae sint excepturi esse alias suscipit corrupti, dolore qui cupiditate! "
      );
      fireEvent.blur(elements.getBioTextArea());

      expect(elements.getBioErr()).toHaveTextContent("Bio must be must not exceed 100 characters");
    });

    it("should remove ErrorMessage Component after correcting the invalid Bio Input", async () => {
      const { elements } = renderUnderTest();
      await userEvent.type(
        elements.getBioTextArea(),
        " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Velit repellat, eligendi maxime nam sapiente nemo accusantium illo qui iure. Deserunt, aut illo. Quae nesciunt repellat distinctio adipisci amet voluptatem aliquam, assumenda autem itaque! Ad, consequatur excepturi? Id possimus fugiat mollitia repudiandae sint excepturi esse alias suscipit corrupti, dolore qui cupiditate! "
      );
      fireEvent.blur(elements.getBioTextArea());
      expect(elements.getBioErr()).toHaveTextContent("Bio must be must not exceed 100 characters");

      await userEvent.clear(elements.getBioTextArea());
      await userEvent.type(
        elements.getBioTextArea(),
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Nemo, similique. "
      );
      fireEvent.blur(elements.getBioTextArea());
      expect(elements.queryBioErr()).not.toBeInTheDocument();
    });
  });

  describe("Avatar File Input", () => {
    const validFile = new File(["foo"], "valid-image.png", { type: "image/png" });
    const invalidFile = new File(["PDF content"], "invalid.pdf", { type: "application/pdf" });

    it("should not show ErrorMessage Component for valid File Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.upload(elements.getFileInput(), validFile);
      fireEvent.blur(elements.getFileInput());

      expect(elements.queryFileErr()).not.toBeInTheDocument();
    });

    it("should show ErrorMessage Component for empty File Input", async () => {
      const { elements } = renderUnderTest();
      const emptyFile = new File([], "");

      await userEvent.upload(elements.getFileInput(), emptyFile);
      fireEvent.blur(elements.getFileInput());

      expect(elements.getFileErr()).toHaveTextContent("Image is required");
    });

    it("should show ErrorMessage Component for invalid File Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.upload(elements.getFileInput(), invalidFile);
      fireEvent.blur(elements.getFileInput());

      expect(elements.getFileErr()).toHaveTextContent("Must be an image");
    });

    it("should remove the ErrorMessage Component after correcting the File Input", async () => {
      const { elements } = renderUnderTest();

      await userEvent.upload(elements.getFileInput(), invalidFile);
      fireEvent.blur(elements.getFileInput());
      expect(elements.getFileErr()).toHaveTextContent("Must be an image");

      await userEvent.upload(elements.getFileInput(), validFile);
      fireEvent.blur(elements.getFileInput());
      expect(elements.queryFileErr()).not.toBeInTheDocument();
    });
  });
});
