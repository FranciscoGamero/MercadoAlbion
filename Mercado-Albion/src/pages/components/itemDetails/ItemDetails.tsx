import { useParams, useNavigate } from "react-router-dom";
import { useAlbionItems } from "../../../hooks/useAlbionItems";
import { Img } from "react-image";
import "./ItemDetails.css";

export function ItemDetails() {
  const { id } = useParams<{ id: string }>(); // Obtener el id desde los parámetros de la URL
  const navigate = useNavigate();
  const { items } = useAlbionItems();

  // Buscar el item correspondiente
  const item = items.find((item) => item.id === id);

  if (!item) {
    return (
      <div className="item-details-container">
        <div className="item-details-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Volver
          </button>
        </div>
        <div className="item-details-content">
          <h1>Item no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="item-details-container">
      <div className="item-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Volver
        </button>
        <h1 className="item-title">{item.titleES || item.titleEN}</h1>
      </div>

      <div className="item-details-content">
        <div className="item-horizontal-info">
          <div className="item-basic-info">
            <Img
              className="item-card-img"
              src={[
                `https://render.albiononline.com/v1/item/${item.id}.png`,
                "/src/assets/placeholder.png",
              ]}
              alt={`${item.titleES || item.titleEN} item`}
              loader={<img src="/src/assets/loader.gif" alt="Cargando..." />}
              unloader={
                <img
                  className="img-failed"
                  src="/src/assets/placeholder.png"
                  alt="Imagen no disponible"
                />
              }
            />
            <div className="item-info-text">
              <p>
                <strong>Descripción:</strong>{" "}
                {item.descriptionES || item.descriptionEN}
              </p>
              <p>
                {item.tier
                  ? `Tier ${item.tier.replace("T", "").replace("_LEVEL", ".")}`
                  : "No disponible"}
              </p>
            </div>
          </div>
          {Array.from({ length: 8 }).some((_, index) =>
            item.id.includes(`T${index + 1}`)
          ) && (
            <div className="item-tier-images">
              {Array.from({ length: 8 }).map((_, index) => {
                const newId = item.id.replace(/T\d+/, `T${index + 1}`);
                const imageUrl = `https://render.albiononline.com/v1/item/${newId}.png`;
                return (
                  <img
                    key={index}
                    className="tier-list"
                    src={imageUrl}
                    alt={`${item.titleES || item.titleEN} T${index + 1}`}
                    style={{ gridRow: index < 4 ? "1" : "2" }}
                    onClick={(e) => {
                      if (e.currentTarget.src.includes("placeholder.png")) {
                        e.preventDefault();
                      } else {
                        navigate(`/item/${newId}`);
                      }
                    }}
                    onError={(e) => {
                      e.currentTarget.src =
                        "src/assets/locales/placeholder.png"; // Ruta del placeholder
                      e.currentTarget.alt = "Imagen no disponible";
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="item-extra-info-horizontal">
          <div className="item-chart-placeholder">
            <h2>Gráfica</h2>
            <p>Espacio reservado para la gráfica</p>
          </div>

          <div className="item-table-placeholder">
            <h2>Tabla de Información</h2>
            <p>Espacio reservado para la tabla</p>
          </div>
        </div>
      </div>
    </div>
  );
}
