import React, { useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FirebaseContext } from "../../firebase/index";
import { useNavigate } from "react-router-dom";
import FileUploader from "react-firebase-file-uploader";

const NuevoPlatillo = () => {
  //state para las imagenes
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlImagen, setUrlImagen] = useState("");

  //hook para redireccionar al usuario
  const navigate = useNavigate();

  //Context con las operaciones de firebase
  const { firebase } = useContext(FirebaseContext);

  console.log(firebase);

  //validacion y leer los datos del formulario
  const formik = useFormik({
    initialValues: {
      nombre: " ",
      precio: "",
      categoria: "",
      imagen: "",
      descripcion: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string()
        .min(3, "Los Platillos deben tener al menos tres caracteres")
        .required("El Nombre del platillo es requerido"),
      precio: Yup.number()
        .min(3, "debes agregar un número")
        .required("El precio del platillo es requerido"),
      categoria: Yup.string().required(
        "La categoría del platillo es requerido"
      ),
      descripcion: Yup.string()
        .min(10, "La descripción debe ser más larga")
        .required("El descripción del platillo es requerido"),
    }),
    onSubmit: (platillo) => {
      try {
        platillo.existencia = true;
        platillo.imagen = urlImagen;
        firebase.db.collection("productos").add(platillo);
        //Redireccionando al usuario
        navigate("/menu");
      } catch (error) {
        console.log(error);
      }
    },
  });

  /*todo sobre las imagenes*/

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };
  const handleUploadError = (error) => {
    setSubiendo(false);
    console.log(error);
  };
  const handleUploadSuccess = async (nombre) => {
    setProgreso(100);
    setSubiendo(false);

    const url = await firebase.storage
      .ref("productos")
      .child(nombre)
      .getDownloadURL();

    console.log(url);
    setUrlImagen(url);
  };

  const handleProgress = (progreso) => {
    setProgreso(progreso);
    console.log(progreso);
  };
  return (
    <>
      <h1 className="text-3xl font-light mb-4">Agregar Platillo</h1>

      <div className="flex justify-center mt-10">
        <div className="w-full max-w-3xl">
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb2 htmlFor="
                nombre
              >
                Nombre
              </label>
              <input
                id="nombre"
                placeholder="Nombre Platillo"
                type="text"
                className="shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                value={formik.values.nombre}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.nombre && formik.errors.nombre ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Hubo un error: </p>
                <p>{formik.errors.nombre}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb2 htmlFor="
                precio
              >
                Precio
              </label>
              <input
                id="precio"
                placeholder="$20.000"
                type="number"
                className="shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                min="0"
                value={formik.values.precio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.precio && formik.errors.precio ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Hubo un error: </p>
                <p>{formik.errors.precio}</p>
              </div>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb2 htmlFor="
                nombre
              >
                Categoria
              </label>
              <select
                id="precio"
                name="categoria"
                className="shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline "
                value={formik.values.categoria}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value=" ">-- Seleccione --</option>
                <option value="desayuno">Desayuno</option>
                <option value="comida">Comida</option>
                <option value="cena">Cena</option>
                <option value="bebida">Bebida</option>
                <option value="postre">Postre</option>
                <option value="ensalada">Ensalada</option>
              </select>
            </div>
            {formik.touched.categoria && formik.errors.categoria ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Hubo un error: </p>
                <p>{formik.errors.categoria}</p>
              </div>
            ) : null}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb2 htmlFor="
                imagen
              >
                Imagen
              </label>
              <FileUploader
                accept="image/*"
                id="imagen"
                name="imagen"
                randomizeFilename
                storageRef={firebase.storage.ref("productos")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
            </div>

            {subiendo && (
              <div className="h-12 relative w-full border">
                <div
                  className="bg-green-500 absolute left-0 top-0 text-white px-2 text-sm h-12 flex items-center"
                  style={{ width: `${progreso}%` }}
                >
                  {progreso} %
                </div>
              </div>
            )}
            {urlImagen && (
              <p className="bg-green-500 text-white p-3 text-center my-5">
                La imagen se subió correctamente
              </p>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb2 htmlFor="
                descripcion
              >
                Descripción
              </label>
              <textarea
                id="descripcion"
                placeholder="Descripcion del platillo"
                className="shadow appearance-none border rounded w-full py-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                value={formik.values.descripcion}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              ></textarea>
            </div>
            {formik.touched.descripcion && formik.errors.descripcion ? (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-5"
                role="alert"
              >
                <p className="font-bold">Hubo un error: </p>
                <p>{formik.errors.descripcion}</p>
              </div>
            ) : null}

            <input
              type="submit"
              className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
              value="Agregar platillo"
            />
          </form>
        </div>
      </div>
    </>
  );
};

export default NuevoPlatillo;
