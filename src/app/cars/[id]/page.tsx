// src/app/cars/[id]/page.tsx
"use client";

import React from "react";
import { notFound, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Fuel,
  Calendar,
  Palette,
  DollarSign,
  Gauge,
  Car,
  MapPin,
  Tag,
  Clock,
  PackageCheck,
  Edit,
  Trash2,
  ArrowLeft,
  ShoppingCart, // Thêm Trash2 vì bạn cần nó cho nút Xóa
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getCarById, deleteCar } from "@/data/cars"; // Import deleteCar
import Link from "next/link";
import { Toaster, toast } from "react-hot-toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog"; // Import ConfirmDialog
import { useCart } from "@/contexts/CartContext";

export default function CarDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();

  const car = getCarById(id);
  if (!car) {
    notFound();
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // State và hàm cho ConfirmDialog
  const [showConfirm, setShowConfirm] = React.useState(false); // Sử dụng React.useState thay vì useState trực tiếp nếu bạn bỏ useEffect
  const handleDeleteCar = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    const isDeleted = deleteCar(car.id);
    if (isDeleted) {
      toast.success(`Xe "${car.name}" đã được xóa thành công!`);
      setShowConfirm(false); // Đóng dialog trước khi điều hướng
      router.refresh(); // Làm mới dữ liệu trên trang đích (cars)
      router.push("/cars"); // Điều hướng về trang danh sách xe
    } else {
      toast.error("Có lỗi xảy ra khi xóa xe.");
      setShowConfirm(false);
    }
  };

  const handleBuyNow = () => {
    router.push(`/checkout?carId=${car.id}`);
  };

  const handleAddToCart = () => {
    addToCart(car);
    toast.success("Đã thêm vào giỏ hàng!");
  };

  const backLinkHref = isAdmin ? "/admin/cars" : "/cars";

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
              <div className="p-4 md:p-6 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                <Link
                  href={backLinkHref}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Quay lại danh sách xe
                </Link>
                {isAdmin && (
                  <div className="flex gap-3">
                    <Link href={`/admin/cars/${car.id}/edit`}>
                      <Button className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md inline-flex items-center gap-2">
                        <Edit className="w-4 h-4" /> Chỉnh sửa
                      </Button>
                    </Link>
                    <Button
                      onClick={handleDeleteCar} // Gọi hàm mở ConfirmDialog
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md inline-flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Xóa xe
                    </Button>
                  </div>
                )}
              </div>

              <div className="md:flex">
                <div className="md:w-1/2 p-4">
                  {car.images && car.images.length > 0 ? (
                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4 border border-gray-200">
                      <Image
                        src={car.images[0]}
                        alt={car.name}
                        fill
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                      />
                    </div>
                  ) : (
                    <div className="relative w-full aspect-video bg-gray-200 flex items-center justify-center rounded-lg mb-4">
                      <Car className="w-24 h-24 text-gray-400" />
                      <p className="absolute text-gray-500">Chưa có hình ảnh</p>
                    </div>
                  )}
                  {car.images && car.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {car.images.slice(1, 5).map((img, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-md overflow-hidden cursor-pointer hover:opacity-75 transition-opacity border border-gray-200"
                        >
                          <Image
                            src={img}
                            alt={`${car.name} - ảnh phụ ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="25vw"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="md:w-1/2 p-6 md:p-8">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                    {car.name}
                  </h1>
                  <p className="text-xl text-blue-600 font-semibold mb-6">
                    {formatPrice(car.price)}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-gray-500" />
                      <span>
                        Thương hiệu:{" "}
                        <span className="font-medium">{car.brand}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-5 h-5 text-gray-500" />
                      <span>
                        Dòng xe:{" "}
                        <span className="font-medium">{car.category}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span>
                        Năm sản xuất:{" "}
                        <span className="font-medium">{car.year}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel className="w-5 h-5 text-gray-500" />
                      <span>
                        Nhiên liệu:{" "}
                        <span className="font-medium">{car.fuel}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Palette className="w-5 h-5 text-gray-500" />
                      <span>
                        Màu sắc:{" "}
                        <span className="font-medium">{car.color}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gauge className="w-5 h-5 text-gray-500" />
                      <span>
                        Số km:{" "}
                        <span className="font-medium">
                          {car.mileage.toLocaleString()} km
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-gray-500" />
                      <span>
                        Hộp số:{" "}
                        <span className="font-medium">
                          {car.transmission === "automatic"
                            ? "Tự động"
                            : "Số sàn"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                      <PackageCheck className="w-5 h-5 text-gray-500" />
                      <span>
                        Trạng thái:{" "}
                        <span
                          className={`font-medium ${
                            car.status === "available"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {car.status === "available"
                            ? "Còn hàng"
                            : car.status === "sold"
                            ? "Đã bán"
                            : "Đã đặt cọc"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2 col-span-1 sm:col-span-2">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span>
                        Cập nhật gần nhất:{" "}
                        <span className="font-medium">
                          {formatDate(car.updatedAt || car.createdAt)}
                        </span>
                      </span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Mô tả chi tiết
                  </h2>
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {car.description ||
                      "Chưa có mô tả chi tiết cho chiếc xe này."}
                  </p>

                  {car.features && car.features.length > 0 && (
                    <>
                      <h2 className="text-2xl font-bold text-gray-900 mb-3">
                        Tính năng nổi bật
                      </h2>
                      <ul className="list-disc list-inside text-gray-700 mb-6">
                        {car.features.map((feature, index) => (
                          <li key={index} className="mb-1">
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {/* Ẩn các nút "Đặt mua ngay" và "Thêm vào giỏ hàng" nếu là admin */}
                  {!isAdmin && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={handleBuyNow}
                        className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg text-lg font-semibold"
                        disabled={car.status !== "available"}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <DollarSign className="w-5 h-5" />{" "}
                          {car.status === "available"
                            ? "Đặt mua ngay"
                            : "Hết hàng"}
                        </span>
                      </Button>
                      <Button
                        onClick={handleAddToCart}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg text-lg font-semibold"
                        disabled={car.status !== "available"}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <ShoppingCart className="w-5 h-5" /> Thêm vào giỏ hàng
                        </span>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
        <Toaster position="top-center" reverseOrder={false} />

        <ConfirmDialog
          isOpen={showConfirm}
          title="Xác nhận xóa xe"
          message={`Bạn có chắc chắn muốn xóa xe "${car.name}"? Hành động này không thể hoàn tác.`}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmDelete}
        />
      </div>
    </ProtectedRoute>
  );
}
