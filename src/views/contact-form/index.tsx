import { useState } from "react";
import { useMutation } from "@apollo/client";
import mutation from "../../gql/mutation";
import Button from "../../components/button";
import Input from "../../components/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type AddContactData = {
  insert_contact: {
    returning: {
      id: number;
      first_name: string;
      last_name: string;
      phones: {
        number: string;
      }[];
    }[];
  };
};

type PhoneInput = {
  number: string;
};

function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneInputs, setPhoneInputs] = useState<PhoneInput[]>([
    { number: "" },
  ]);

  const [addContact, { loading, error }] = useMutation<AddContactData>(
    mutation.ADD_CONTACT_WITH_PHONES_MUTATION
  );

  function handleFirstNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstName(event.target.value);
  }

  function handleLastNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLastName(event.target.value);
  }

  function handlePhoneInputChange(
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const newPhoneInputs = [...phoneInputs];
    newPhoneInputs[index].number = event.target.value;
    setPhoneInputs(newPhoneInputs);
  }

  function handleAddPhoneInput() {
    setPhoneInputs([...phoneInputs, { number: "" }]);
  }
  function handleRemovePhoneInput(index: number) {
    let newPhoneInputs = JSON.parse(JSON.stringify(phoneInputs));
    newPhoneInputs.splice(index, 1);
    console.log(newPhoneInputs);
    setPhoneInputs(newPhoneInputs);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const phones = phoneInputs.map((input) => ({ number: input.number }));
    try {
      const { data } = await addContact({
        variables: { first_name: firstName, last_name: lastName, phones },
      });
      setFirstName("");
      setLastName("");
      setPhoneInputs([{ number: "" }]);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form className="pt-4 container" onSubmit={handleSubmit}>
      <div>
        <Input
          name="First Name"
          label="First Name"
          placeholder="First Name"
          type="text"
          value={firstName}
          onChange={handleFirstNameChange}
          required
        />
      </div>
      <div>
        <Input
          name="Last Name"
          label="Last Name"
          placeholder="Last Name"
          type="text"
          value={lastName}
          onChange={handleLastNameChange}
          required
        />
      </div>
      {phoneInputs.map((input, index, array) => (
        <div key={index}>
          <Input
            name={`Phone ${index + 1}`}
            label={`Phone ${index + 1}`}
            placeholder={`Phone ${index + 1}`}
            type="text"
            value={input.number}
            onChange={(event) => handlePhoneInputChange(index, event)}
            required
            extra={
              phoneInputs.length > 1 ? (
                <Button
                  type="button"
                  onClick={() => handleRemovePhoneInput(index)}
                  color="danger"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              ) : null
            }
          />
        </div>
      ))}
      <div className="mb-2">
        <Button outlined color="light_grey" className="w-100" type="button" onClick={handleAddPhoneInput}>
          Add Phone
        </Button>
        </div>
        <div>
            
        <Button className="w-100" type="submit" disabled={loading}>
          Save
        </Button>
      </div>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

export default ContactForm;
