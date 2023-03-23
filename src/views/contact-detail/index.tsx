import Button from "../../components/button";
import Card from "../../components/card";
import { useMutation, useQuery } from "@apollo/client";
import queries from "../../gql/queries";
import ContactIcon from "../../components/contact-icon";
import { useNavigate, useParams } from "react-router";
import mutation from "../../gql/mutation";
import { toast } from "react-toastify";
import { useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

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

const ContactDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [confirmation, setConfirmation] = useState(false);
  const [deleteContact] = useMutation(mutation.DELETE_CONTACT, {});
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const favoriteData: ContactDetailData = {
    contact_by_pk: favorites.find(
      (v: { id: string  }) => id === v.id.toString()
    ),
  };
  const isFavorite = favorites.map((v: { id: number }) => v.id.toString())
  .indexOf(id) !== -1
  const { loading, error, data } = useQuery<ContactDetailData>(
    queries.GET_CONTACT_DETAIL,
    {
      variables: { id: id && parseInt(id, 10) },
    }
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if ((!data || !data.contact_by_pk) && !favoriteData)
    return <p>Contact not found</p>;

  const trueData = data?.contact_by_pk || favoriteData.contact_by_pk;

  const { first_name, last_name, phones } = trueData;
  let fullName = `${first_name} ${last_name}`;
  const handleAddFavorites = async () => {
    try {
      let { data } = await deleteContact({ variables: { id } });
      let { delete_contact_by_pk } = data;
      setFavorites([...favorites, {...delete_contact_by_pk, phones}]);
      toast.success(`${fullName} has been added to favorites`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };
  const handleDeleteFromFavorite = async () => {
    const newFavorite = JSON.parse(JSON.stringify(favorites));
    let index = newFavorite
      .map((v: { id: number }) => v.id.toString())
      .indexOf(id);
    newFavorite.splice(index, 1);
    toast.success(`${fullName} have been removed from favorites`);
    setFavorites(newFavorite)
    navigate("/");
  };
  const handleDelete = async () => {
    try {
      await deleteContact({ variables: { id } });
      toast.success(`${fullName} have been removed from contacts`);
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container pt-4 px-2 d-flex flex-column justify-content-center align-items-center">
      <ContactIcon>{fullName}</ContactIcon>
      <p className="mb-2 w-100 text-center">{fullName}</p>

      <div className="mb-4">
        {!isFavorite ? (
          <Button onClick={handleAddFavorites} color="orange">
            <FontAwesomeIcon icon={faStar} />
            Add to Favorite
          </Button>
        ) : (
          <Button color="dark_grey">Favorited</Button>
        )}
      </div>
      {phones &&
        phones.map((value, index) => {
          return (
            <Card small key={`phone${value.number}`} className="mb-2">
              <div>{value.number}</div>
            </Card>
          );
        })}

      <div className="w-100 mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {confirmation && <p className="mb-0 me-2">Are you sure?</p>}
          {confirmation && (
            <Button
              className="mx-2"
              outlined
              color="space_grey"
              onClick={() => {
                setConfirmation(false);
              }}
            >
              Cancel
            </Button>
          )}
          <Button
            className="ms-2"
            onClick={() => {
              if (isFavorite) {
                handleDeleteFromFavorite();
              } else {
                !confirmation ? setConfirmation(true) : handleDelete();
              }
            }}
            color="danger"
            outlined
          >
            Delete Contact
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactDetail;
