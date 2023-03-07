export default function getIconNameForStep(type) {
    let iconName = type.toLowerCase();
    if(type === "HEAVY_RAIL") iconName = "train";
    return iconName;
}