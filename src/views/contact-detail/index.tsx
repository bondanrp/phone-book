import { useEffect, useState } from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import { useQuery } from "@apollo/client";
import queries from "../../gql/queries";
import { getName } from "../../helper/functions";
import ContactIcon from "../../components/contact-icon";
import { useParams } from "react-router";
import { Link } from "react-router-dom";

type ContactDetailData = {
    contact_by_pk: {
      id: number;
      first_name: string;
      last_name: string;
      created_at: string;
      phones: {
        number: string;
      }[];
    };
  };


const ContactDetail= () => {
    const { id } = useParams<{ id: string }>();
    const { loading, error, data } = useQuery<ContactDetailData>(queries.GET_CONTACT_DETAIL, {
      variables: { id: id&&parseInt(id, 10) },
    });
  
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    if (!data || !data.contact_by_pk) return <p>Contact not found</p>;
  
    const { first_name, last_name, created_at, phones } = data.contact_by_pk;
  let fullName = `${first_name} ${last_name}`;
  return (
    <div className="container pt-4 px-2 d-flex flex-column justify-content-center align-items-center">

      <ContactIcon>{fullName}</ContactIcon>
      <p className="mb-2 w-100 text-center">
        {fullName}
      </p>
      {phones.map((value, index) => {
        return (
          <Card key={`phone${value.number}`} className="mb-2">
            <div>{value.number}</div>
          </Card>
        );
      })}
    </div>
  );
};

export default ContactDetail;
