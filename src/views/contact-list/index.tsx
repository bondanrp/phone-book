/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useState } from "react";
import Button from "../../components/button";
import Card from "../../components/card";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../../gql/queries";
import ContactIcon from "../../components/contact-icon";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import useLocalStorage from "../../hooks/useLocalStorage";
import Input from "../../components/input";
import useDebounce from "../../hooks/useDebounce";
import { toast } from "react-toastify";
import mutation from "../../gql/mutation";

interface Contact {
  created_at: string;
  first_name: string;
  id: number;
  last_name: string;
  phones: { number: string }[];
}
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

const ContactList: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [deleteContact] = useMutation(mutation.DELETE_CONTACT, {});
  const [addContact] = useMutation<AddContactData>(
    mutation.ADD_CONTACT_WITH_PHONES_MUTATION
  );
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 1000);
  const { error, data, refetch } = useQuery(queries.GET_CONTACT_LIST, {
    variables: {
      limit: 10,
      offset: (currentPage - 1) * 10,
      order_by: { last_name: "asc" },
      where: {
        _or: [
          { last_name: { _ilike: `%${debouncedQuery}%` } },
          { first_name: { _ilike: `%${debouncedQuery}%` } },
        ],
      },
    },
  });
  useEffect(() => {
    refetch({
      limit: 10,
      offset: (currentPage - 1) * 10,
    });
  }, [currentPage, debouncedQuery]);

  if (error) return <p>Error</p>;
  const handlePrevClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };
  const handleNextClick = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  function sortByLastName(arr: Contact[]) {
    return arr
      .filter(
        (v) =>
          v.first_name.toUpperCase().includes(debouncedQuery.toUpperCase()) ||
          v.last_name.toUpperCase().includes(debouncedQuery.toUpperCase())
      )
      .sort((a: Contact, b: Contact) => {
        const nameA = a.last_name.toUpperCase();
        const nameB = b.last_name.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
  }
  const handleAddFavorites = async (
    id: number,
    phones: { number: string }[]
  ) => {
    try {
      let { data } = await deleteContact({ variables: { id } });
      let { delete_contact_by_pk } = data;
      setFavorites([...favorites, { ...delete_contact_by_pk, phones }]);
      refetch();
      toast.success(
        `${delete_contact_by_pk.first_name} ${delete_contact_by_pk.last_name} has been added to favorites`
      );
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteFromFavorite = async (id: number) => {
    try {
      const newFavorite = JSON.parse(JSON.stringify(favorites));
      let index = newFavorite.map((v: { id: number }) => v.id).indexOf(id);
      console.log(newFavorite[index].first_name);
      let firstName = newFavorite[index].first_name;
      let lastName = newFavorite[index].last_name;
      let phones = newFavorite[index].phones.map((v: { number: number }) => ({
        number: v.number,
      }));
      await addContact({
        variables: {
          first_name: firstName,
          last_name: lastName,
          phones,
        },
      });
      newFavorite.splice(index, 1);
      toast.success(
        `${firstName} ${lastName} have been removed from favorites`
      );
      refetch();
      setFavorites(newFavorite);
    } catch (error3) {
      console.error(error3);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      let { data } = await deleteContact({ variables: { id } });
      let { delete_contact_by_pk } = data;
      refetch();
      toast.success(
        `${delete_contact_by_pk.first_name} ${delete_contact_by_pk.last_name} have been removed from contacts`
      );
    } catch (error2) {
      console.error(error2);
    }
  };
  const sortedFavorites = sortByLastName(favorites);
  let { contact } = data || { contact: [] };
  return (
    <div
      css={css`
        max-width: 400px;
      `}
      className="container d-flex justify-content-center flex-column pt-3"
    >
      <Input
        placeholder="Search..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setSearchQuery(e.target.value)
        }
        value={searchQuery}
      />
      <Link
        className="text-decoration-none text-primary fw-bold"
        to={`/create`}
      >
        <Card small className="mb-2">
          <div className="d-flex align-items-center">
            <div>+</div>

            <p className="mb-0 ms-2">Create New Contact</p>
          </div>
        </Card>
      </Link>
      <div className="mb-2">
        <h4>Favorites</h4>
        {sortedFavorites.length ? (
          sortedFavorites.map((v: Contact, i: number) => {
            let fullName = `${v.first_name} ${v.last_name}`;

            return (
              <Card key={v.id} small className="mb-2">
                <div
                  css={css`
                    button {
                      display: none;
                    }
                    &:hover {
                      button {
                        display: block;
                      }
                    }
                  `}
                  className="d-flex align-items-center justify-content-between"
                >
                  <Link
                    className="text-decoration-none text d-flex align-items-center justify-content-between"
                    to={`/detail/${v.id}`}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <ContactIcon small>{fullName}</ContactIcon>

                        <p className="mb-0 ms-2">
                          {v.first_name}{" "}
                          <span className="fw-bold">{v.last_name}</span>
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      className="me-2"
                      onClick={() => {
                        handleDeleteFromFavorite(v.id);
                      }}
                      small
                      color="orange"
                    >
                      <FontAwesomeIcon size="xs" icon={faStar} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center my-3">No Contacts to show</div>
        )}
      </div>
      <div>
        <h4>Contacts</h4>

        {contact.length ? (
          contact.map((v: Contact, i: number) => {
            let fullName = `${v.first_name} ${v.last_name}`;

            return (
              <Card key={v.id} small className="mb-2">
                <div
                  css={css`
                    button {
                      display: none;
                    }
                    &:hover {
                      button {
                        display: block;
                      }
                    }
                  `}
                  className="d-flex align-items-center justify-content-between"
                >
                  <Link
                    to={`/detail/${v.id}`}
                    className="text-decoration-none text d-flex align-items-center justify-content-between"
                  >
                    <ContactIcon small>{fullName}</ContactIcon>

                    <p className="mb-0 ms-2">
                      {v.first_name}{" "}
                      <span className="fw-bold">{v.last_name}</span>
                    </p>
                  </Link>
                  <div className="d-flex justify-content-center align-items-center">
                    <Button
                      className="me-2"
                      onClick={() => {
                        handleAddFavorites(v.id, v.phones);
                      }}
                      small
                      color="orange"
                    >
                      <FontAwesomeIcon size="xs" icon={faStar} />
                    </Button>
                    <Button
                      onClick={() => {
                        handleDelete(v.id);
                      }}
                      small
                      color="danger"
                    >
                      <FontAwesomeIcon size="xs" icon={faTrash} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center mt-2">No Contacts to show</div>
        )}
      </div>
      <div className="mt-2 mb-5 d-flex justify-content-between">
        <Button disabled={currentPage === 1} onClick={handlePrevClick}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </Button>

        <Button disabled={contact.length < 10} onClick={handleNextClick}>
          <FontAwesomeIcon icon={faArrowRight} />
        </Button>
      </div>
    </div>
  );
};

export default ContactList;
