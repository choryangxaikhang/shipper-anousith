import { useApolloClient, useMutation } from "@apollo/client";
import React, { useContext, useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";
import { AppContext } from "../../App";
import {
  aws_url_image,
  messageError,
  messageSuccess,
  TOKEN,
} from "../../helper";
import male from "../../img/male.png";
import female from "../../img/woman-avatar.png";
import { CONFIRM_PASSWORD, PRESIGNED_URL, UPDATE_CUSTOMER } from "./apollo";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import Notiflix, { Loading } from "notiflix";
import { CUSTOMER_LOGIN } from "../login/gql";

export default function UpdateImage({ show = false, onHide }) {
  const { userState, userDispatch } = useContext(AppContext);
  const userData = userState?.data;
  const [image, setImage] = useState(null);
  const client = useApolloClient();
  const [password, setPassword] = useState();

  const [updateCustomer] = useMutation(UPDATE_CUSTOMER);
  const [confirmPassword] = useMutation(CONFIRM_PASSWORD);
  const [customerLogin] = useMutation(CUSTOMER_LOGIN);

  const handleChange = (e) => {
    const _image = e.target.files[0];
    if (_image) setImage(_image);
  };

  const onLogin = async () => {
    try {
      const { data: customerData } = await confirmPassword({
        variables: {
          where: {
            username: userData?.username,
            password: password,
          },
        },
      });
      if (customerData) {
        onSubmit();
      } else {
        messageError("ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
      }
    } catch (error) {
      messageError("ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ");
    }
  };

  const onSubmit = async () => {
    if (!image) return;
    Loading.dots()
    try {
      const imageName = uuidv4() + "." + image?.type.split("/")[1];
      const { data: url } = await client.query({
        query: PRESIGNED_URL,
        variables: {
          name: imageName,
        },
      });

      const response = await axios({
        method: "put",
        url: url?.preSignedUrl?.url,
        data: image,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
      });

      if (response?.status !== 200) {
        Notiflix.Loading.remove();
        messageError("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
        return;
      }

      const { data: updateData } = await updateCustomer({
        variables: {
          data: { image: imageName },
          where: { _id: userData?._id },
        },
      });
      if (updateData) {
        const { data: customerData } = await customerLogin({
          variables: {
            where: {
              username: userData?.username,
              password: password,
            },
          },
        });

        if (customerData) {
          Notiflix.Loading.remove();
          localStorage.setItem(
            TOKEN,
            JSON.stringify(customerData?.customerLogin)
          );
          messageSuccess("ອັບໂຫຼດຮູບພາບສຳເລັດແລ້ວ");
          userDispatch({
            type: "login",
            payload: customerData?.customerLogin,
          });
          if (onHide) onHide();
        } else {
          Notiflix.Loading.remove();
          messageError("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
        }
      } else {
        Notiflix.Loading.remove();
        messageError("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
      }
    } catch (error) {
      Notiflix.Loading.remove();
      messageError("ການອັບໂຫຼດຮູບພາບບໍ່ສຳເລັດ");
      console.log(error);
    }
  };

  return (
    <>
    <Modal
      show={show}
      centered
      onHide={(e) => {
        if (onHide) onHide(e);
      }}
      animation={false}
    >
      <Modal.Header>ແກ້ໄຂຮູບໂປຣໄຟລ໌</Modal.Header>
      <Modal.Body>
        <div className="text-center">
          <input
            type={"file"}
            id="input-image"
            hidden
            accept="image/*"
            onChange={handleChange}
          />
          <label htmlFor="input-image">
            <Image
              src={
                image
                  ? URL.createObjectURL(image)
                  : userData?.image
                  ? aws_url_image + userData?.image
                  : userData?.gender === "MALE"
                  ? male
                  : userData?.gender === "FEMALE"
                  ? female
                  : male
              }
              style={{ width: 120, height: 120 }}
              className="bg-white rounded-circle"
            />
          </label>
        </div>
        <p className="mt-2 text-danger text-center">
          <em>ຄລິກໃສ່ຮູບພາບເພື່ອເລືອກຮູບພາບໃໝ່</em>
        </p>

        <div className="mt-2">
          <label><span className="invalid">*</span> ຫາກຕ້ອງການດຳເນີນການຕໍ່ກະລຸນາປ້ອນລະຫັດຜ່ານຂອງທ່ານ.</label>
          <input
            type={"password"}
            className="form-control form-control-lg"
            placeholder="ລະຫັດຜ່ານ"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          onClick={onLogin}
          disabled={!password}
          className="rounded"
        >
          ແກ້ໄຂ
        </Button>
        <Button
          variant="secondary"
          onClick={(e) => {
            if (onHide) onHide(e);
          }}
          className="rounded"
        >
          ຍົກເລີກ
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}
