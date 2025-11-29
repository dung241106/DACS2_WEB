import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Lấy chuỗi kết nối từ biến môi trường và nối thêm tên database
    const MONGODB_URI = `${process.env.MONGODB_URL}/quickshow`;

    // 1. Kết nối đến MongoDB
    const conn = await mongoose.connect(MONGODB_URI);

    // 2. Set listener cho sự kiện kết nối thành công

    mongoose.connection.on("connected", () => {
      console.log("✅ DB Status: Connected successfully!");
    });

    // 3. Set listener cho lỗi sau khi kết nối ban đầu
    mongoose.connection.on("error", (err) => {
      console.error(`❌ MongoDB connection error (Runtime): ${err}`);
    });

    console.log(
      `✅ MongoDB Initial connection successful: ${conn.connection.host}`
    );
  } catch (error) {
    // Xử lý lỗi trong quá trình kết nối ban đầu
    console.error(`❌ DB Connection Failed: ${error.message}`);
    // Thoát ứng dụng nếu không thể kết nối
    process.exit(1);
  }
};

export default connectDB;
