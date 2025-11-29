import { useParams, useNavigate } from "react-router-dom";
import { useAlbionItems } from "../../../hooks/useAlbionItems";
import "./ItemDetails.css";
import ItemChart from "./components/ItemChart";
import { useTranslation } from "react-i18next";

export function ItemDetails() {
  const { t } = useTranslation(); // Initialize translation hook
  const { id } = useParams<{ id: string }>(); // Obtener el id desde los parámetros de la URL
  const navigate = useNavigate();
  const { items } = useAlbionItems();

  // Buscar el item correspondiente
  const item = items.find((item) => item.id === id);
  const getTierFromUniqueName = (
    uniqueName: string,
    number: number
  ): string | undefined => {
    const resourceKeywords = [
      "ore",
      "wood",
      "stone",
      "fiber",
      "hide",
      "leather",
      "cloth",
      "metalbar",
      "planks",
      "stoneblock",
      "essence",
    ];
    if (resourceKeywords.some((k) => uniqueName.toLowerCase().includes(k))) {
      return `LEVEL${number}`;
    } else {
      const tierMatch = uniqueName.match(/T(\d+)/);
      const variantMatch = uniqueName.match(/@(\d+)/);
      if (tierMatch) {
        const variant = variantMatch ? variantMatch[1] : "";
        return variant;
      }
    }
    return undefined;
  };
  if (!item) {
    return (
      <div className="item-details-container">
        <div className="item-details-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ← {t("back")}
          </button>
        </div>
        <div className="item-details-content">
          <h1>{t("item_not_found")}</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="item-details-container">
      <div className="item-details-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← {t("back")}
        </button>
        <h1 className="item-title">{item.titleES || item.titleEN}</h1>
      </div>

      <div className="item-details-content">
        <div className="item-horizontal-info">
          <div
            className="item-basic-info"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <img
                className="item-card-img"
                src={`https://render.albiononline.com/v1/item/${item.id}.png`}
                alt={`${item.titleES || item.titleEN} item`}
                style={{ flexShrink: 0 }}
                onError={(e) => {
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const noImageDiv = document.createElement("div");
                    noImageDiv.textContent = t("not_found");
                    noImageDiv.style.textAlign = "center";
                    noImageDiv.style.color = "#A83D06";
                    noImageDiv.style.backgroundColor = "#fcfbfbff";
                    noImageDiv.style.fontSize = "0.9rem";
                    noImageDiv.style.fontWeight = "bold";
                    noImageDiv.style.display = "flex";
                    noImageDiv.style.alignItems = "center";
                    noImageDiv.style.justifyContent = "center";
                    noImageDiv.style.height = "90px";
                    noImageDiv.style.width = "90px";
                    noImageDiv.style.border = "1px dashed #A83D06";
                    noImageDiv.style.borderRadius = "8px";
                    noImageDiv.style.paddingLeft = "5px";
                    noImageDiv.style.paddingRight = "5px";
                    noImageDiv.style.userSelect = "none"; // Prevent text selection
                    parent.replaceChild(noImageDiv, e.currentTarget); // Replace image with styled div
                  }
                }}
              />
              <div className="item-info-text" style={{ flex: 1 }}>
                <p>
                  <strong>{t("description")}:</strong>{" "}
                  {item.descriptionES || item.descriptionEN}
                </p>
                <p>
                  {item.tier
                    ? `${t("tier")} ${item.tier
                        .replace("T", "")
                        .replace("_LEVEL", ".")}`
                    : t("not_available")}
                </p>
              </div>
            </div>
            <div
              className="item-tier-variants d-flex w-full"
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              {/* Check if there are any valid variants */}
              {Array.from({ length: 4 }).some((_, variantIndex) =>
                getTierFromUniqueName(item.id, variantIndex + 1)
              ) ? (
                <>
                  {/* Add the base item without any variant */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      className="tier-list cursor-pointer"
                      src={`https://render.albiononline.com/v1/item/${item.id
                        .replace(/_LEVEL\d+@\d+$/, "")
                        .replace(/@\d+$/, "")}.png`}
                      alt={`${item.titleES || item.titleEN} Base Item`}
                      onClick={(e) => {
                        e.preventDefault();
                        const baseId = item.id
                          .replace(/_LEVEL\d+@\d+$/, "")
                          .replace(/@\d+$/, "");
                        navigate(`/item/${baseId}`);
                      }}
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const noImageDiv = document.createElement("div");
                          noImageDiv.textContent = `Not Found`;
                          noImageDiv.style.textAlign = "center";
                          noImageDiv.style.color = "#A83D06";
                          noImageDiv.style.backgroundColor = "#fcfbfbff";
                          noImageDiv.style.fontSize = "0.9rem";
                          noImageDiv.style.fontWeight = "bold";
                          noImageDiv.style.display = "flex";
                          noImageDiv.style.alignItems = "center";
                          noImageDiv.style.justifyContent = "center";
                          noImageDiv.style.height = "90px";
                          noImageDiv.style.width = "90px";
                          noImageDiv.style.border = "1px dashed #A83D06";
                          noImageDiv.style.borderRadius = "8px";
                          noImageDiv.style.paddingLeft = "5px";
                          noImageDiv.style.paddingRight = "5px";
                          noImageDiv.style.userSelect = "none"; // Prevent text selection
                          parent.replaceChild(noImageDiv, e.currentTarget); // Replace image with styled div
                        }
                      }}
                    />
                  </div>

                  {/* Render the variants */}
                  {Array.from({ length: 4 }).map((_, variantIndex) => {
                    const variant = getTierFromUniqueName(item.id, variantIndex + 1);
                    if (variant) {
                      const baseId = item.id
                        .replace(/_LEVEL\d+@\d+$/, "")
                        .replace(/@\d+$/, "");
                      const imageUrl = `https://render.albiononline.com/v1/item/${
                        baseId
                      }${
                        variant.includes("LEVEL")
                          ? `_LEVEL${variant.replace("LEVEL", "")}@${variantIndex + 1}`
                          : `@${variant}`
                      }.png`;
                      return (
                        <div
                          key={variantIndex}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            className="tier-list cursor-pointer"
                            src={imageUrl}
                            alt={`${item.titleES || item.titleEN} T${item.id} Variant ${variant}`}
                            onClick={(e) => {
                              e.preventDefault();
                              const newId = `${baseId}${
                                variant.includes("LEVEL")
                                  ? `_LEVEL${variant.replace("LEVEL", "")}@${variantIndex + 1}`
                                  : `@${variant}`
                              }`;
                              navigate(`/item/${newId}`);
                            }}
                            onError={(e) => {
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const noImageDiv = document.createElement("div");
                                noImageDiv.textContent = `Not Found`;
                                noImageDiv.style.textAlign = "center";
                                noImageDiv.style.color = "#A83D06";
                                noImageDiv.style.backgroundColor = "#fcfbfbff";
                                noImageDiv.style.fontSize = "0.9rem";
                                noImageDiv.style.fontWeight = "bold";
                                noImageDiv.style.display = "flex";
                                noImageDiv.style.alignItems = "center";
                                noImageDiv.style.justifyContent = "center";
                                noImageDiv.style.height = "90px";
                                noImageDiv.style.width = "90px";
                                noImageDiv.style.border = "1px dashed #A83D06";
                                noImageDiv.style.borderRadius = "8px";
                                noImageDiv.style.paddingLeft = "5px";
                                noImageDiv.style.paddingRight = "5px";
                                noImageDiv.style.userSelect = "none"; // Prevent text selection
                                parent.replaceChild(noImageDiv, e.currentTarget); // Replace image with styled div
                              }
                            }}
                          />
                        </div>
                      );
                    }
                    return null; // Skip rendering if no valid variant is found
                  })}
                </>
              ) : null}
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
                  <div
                    key={index}
                    style={{
                      gridRow: index < 4 ? "1" : "2",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      className="tier-list cursor-pointer"
                      src={imageUrl}
                      alt={`${item.titleES || item.titleEN} T${index + 1}`}
                      onClick={(e) => {
                        if (
                          e.currentTarget.src.includes("placeholder.png") ||
                          e.currentTarget.tagName === "DIV"
                        ) {
                          e.preventDefault();
                          return; // Prevent navigation for missing images or divs
                        }
                        navigate(`/item/${newId}`);
                      }}
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          const noImageDiv = document.createElement("div");
                          noImageDiv.textContent = `Not Found`;
                          noImageDiv.style.textAlign = "center";
                          noImageDiv.style.color = "#A83D06";
                          noImageDiv.style.backgroundColor = "#fcfbfbff";
                          noImageDiv.style.fontSize = "0.9rem";
                          noImageDiv.style.fontWeight = "bold";
                          noImageDiv.style.display = "flex";
                          noImageDiv.style.alignItems = "center";
                          noImageDiv.style.justifyContent = "center";
                          noImageDiv.style.height = "90px";
                          noImageDiv.style.width = "90px";
                          noImageDiv.style.border = "1px dashed #A83D06";
                          noImageDiv.style.borderRadius = "8px";
                          noImageDiv.style.paddingLeft = "5px";
                          noImageDiv.style.paddingRight = "5px";
                          noImageDiv.style.userSelect = "none"; // Prevent text selection
                          parent.replaceChild(noImageDiv, e.currentTarget); // Replace image with styled div
                        }
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="item-chart-placeholder">
          <ItemChart itemId={item.id} />
        </div>
      </div>
    </div>
  );
}
