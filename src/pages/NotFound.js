import styled from "styled-components";

const NotFound = () => {
  const Div = styled.div`
    align-items: center;
    justify-items: center;
    text-align: center;
    justify-content: center;
    margin: 150px auto 150px auto;
  `;

  return (
    <Div>
      <h1>Page Not Found</h1>
      <h2>ERROR 404</h2>
    </Div>
  );
};

export default NotFound;
