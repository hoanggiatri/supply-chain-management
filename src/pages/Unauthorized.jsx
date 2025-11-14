import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Bạn không có quyền truy cập trang này!</h2>
      <p>Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là lỗi.</p>
      <Link to="/homepage">Quay lại trang chủ</Link>
    </div>
  );
};

export default Unauthorized;
