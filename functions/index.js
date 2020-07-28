const getMeta = ({ title = "", url = "", description = "", image = "" }) => {
  return {
    title: title,
    meta: [
      {
        hid: "title",
        name: "title",
        content: title
      },
      {
        hid: "description",
        name: "description",
        content: description
      },
      {
        hid: "og:title",
        property: "og:title",
        content: title
      },
      { hid: "og:url", property: "og:url", content: url },
      {
        hid: "og:description",
        property: "og:description",
        content: description
      },
      {
        hid: "og:image",
        property: "og:image",
        content: image
      },
      {
        hid: "twitter:title",
        property: "twitter:title",
        content: title
      },
      {
        hid: "twitter:url",
        property: "twitter:url",
        content: url
      },
      {
        hid: "twitter:description",
        property: "twitter:description",
        content: description
      },
      {
        hid: "twitter:image",
        property: "twitter:image",
        content: image
      }
    ]
  };
};

export { getMeta };
