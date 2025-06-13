export const responseError = (res, err) => {
  return res.status(400).send({
    status: "error",
    msg: err,
  });
};
