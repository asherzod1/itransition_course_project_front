const CollectionImage = ({ photo }) => {
  // Convert the array of numbers to a Uint8Array
  const uint8Array = new Uint8Array(photo.data);

  // Convert the Uint8Array to a base64-encoded string
  const base64String = btoa(String.fromCharCode.apply(null, uint8Array));

  // Create the data URL
  const dataUrl = `data:${photo.type};base64,${base64String}`;

  return <img src={dataUrl} alt="Collection Photo" />;
};

export default CollectionImage;
