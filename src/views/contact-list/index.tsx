import { useEffect, useState } from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import { useQuery } from "@apollo/client";
import queries from "../../gql/queries";
import "./index.scss";
import { getName } from "../../helper/functions";
import ContactIcon from "../../components/contact-icon";
import { Link } from "react-router-dom";

interface Contact {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: { number: string }[];
}

interface ContactListProps {
  distinct_on?: string[];
  limit?: number;
  offset?: number;
  order_by?: string[];
  where?: Record<string, unknown>;
}

interface DetailProps {
  data: Contact;
}

const ContactList: React.FC<ContactListProps> = ({
  distinct_on,
  limit,
  offset,
  order_by,
  where,
}) => {
  const { loading, error, data } = useQuery(queries.GET_CONTACT_LIST, {
    variables: { distinct_on, limit, offset, order_by, where },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div className="container pt-3">
      <Link
        className="col-xl-3 col-12 text-decoration-none text-primary fw-bold"
        to={`/create`}
      >
        <Card className="mb-2">
          <div className="d-flex align-items-center">
            <div>+</div>

            <p className="mb-0 ms-2">Create New Contact</p>
          </div>
        </Card>
      </Link>
      <div className="row">
        {data.contact
          ? data.contact.map((v: Contact, i: number) => {
              let fullName = `${v.first_name} ${v.last_name}`;

              return (
                <Link
                  key={v.id}
                  className="col-xl-3 col-12 text-decoration-none text"
                  to={`/detail/${v.id}`}
                >
                  <Card className="mb-2">
                    <div className="d-flex align-items-center">
                      <ContactIcon small>{fullName}</ContactIcon>

                      <p className="mb-0 ms-2">
                        {v.first_name} {v.last_name}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })
          : ""}
      </div>
    </div>
  );
};

export default ContactList;
