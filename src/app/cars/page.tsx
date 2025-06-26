"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Car,
  Fuel,
  Calendar,
  Palette,
  PlusCircle,
  Edit,
  Trash2,
  Tag,
  Gauge,
  Eye,
} from "lucide-react";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/ui/Button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { getCars, deleteCar } from "@/data/cars";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";

export default function CarsPage() {
  const router = useRouter();
  const { isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [carList, setCarList] = useState(getCars());

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const confirmDeleteCar = (id: string, name: string) => {
    setSelectedCar({ id, name });
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCar) {
      const success = deleteCar(selectedCar.id);
      if (success) {
        toast.success(`Xe "${selectedCar.name}" đã được xóa.`);
        setCarList(getCars());
      } else {
        toast.error("Đã xảy ra lỗi khi xóa xe.");
      }
    }
    setIsConfirmOpen(false);
    setSelectedCar(null);
  };

  const backLinkHref = isAdmin ? "/admin" : "/";

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />

        <main className="flex-grow py-8 md:py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <h1 className="text-3xl font-extrabold text-gray-900">
                {isAdmin ? "Quản lý Xe" : "Tất Cả Xe Hiện Có"}
              </h1>
            </div>

            {carList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-lg shadow-md">
                <p className="text-2xl font-semibold text-gray-600 mb-4">
                  Hiện chưa có chiếc xe nào để hiển thị.
                </p>
                {isAdmin && (
                  <Link href="/admin/cars/new">
                    <Button className="mt-6 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg">
                      <PlusCircle className="w-6 h-6 mr-2" /> Thêm xe đầu tiên
                      ngay!
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {carList.map((car) => (
                  <div
                    key={car.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col transform hover:scale-102 transition-all duration-300 border border-gray-100"
                  >
                    <div className="relative w-full h-48 sm:h-56">
                      {car.images && car.images.length > 0 ? (
                        <Image
                          src={car.images[0]}
                          alt={car.name}
                          fill
                          style={{ objectFit: "cover" }}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          className="rounded-t-xl"
                        />
                      ) : (
                        <div className="bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center h-full rounded-t-xl">
                          <Car className="w-20 h-20 text-gray-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3 flex flex-col gap-2">
                        <span className="bg-blue-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                          {car.category}
                        </span>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full shadow-md ${
                            car.status === "available"
                              ? "bg-green-500"
                              : car.status === "sold"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          } text-white`}
                        >
                          {car.status === "available"
                            ? "Còn hàng"
                            : car.status === "sold"
                            ? "Đã bán"
                            : "Đã đặt cọc"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-tight">
                        {car.name}
                      </h3>
                      <p className="text-3xl font-bold text-blue-700 mb-4">
                        {formatPrice(car.price)}
                      </p>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-700 mb-4 flex-grow">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span>{car.year}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Fuel className="w-4 h-4 text-gray-500" />
                          <span>{car.fuel}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Palette className="w-4 h-4 text-gray-500" />
                          <span>{car.color}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Gauge className="w-4 h-4 text-gray-500" />
                          <span>{car.mileage.toLocaleString()} km</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <Tag className="w-4 h-4 text-gray-500" />
                          <span>
                            {car.brand} {car.model}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                        {car.description || "Chưa có mô tả ngắn gọn."}
                      </p>

                      <div className="mt-auto flex justify-end gap-2 pt-4 border-t border-gray-100">
                        {isAdmin ? (
                          <>
                            <Link href={`/cars/${car.id}`} className="flex-1">
                              <Button
                                className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                            </Link>
                            <Link
                              href={`/admin/cars/${car.id}/edit`}
                              className="flex-1"
                            >
                              <Button
                                className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 transition-colors flex items-center justify-center"
                                title="Sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </Button>
                            </Link>
                            <Button
                              onClick={() => confirmDeleteCar(car.id, car.name)}
                              className="flex-1 bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center"
                              title="Xóa"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Link href={`/cars/${car.id}`} className="w-full">
                              <Button className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors font-semibold text-lg">
                                Xem chi tiết
                              </Button>
                            </Link>
                            <Button
                              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-semibold text-lg"
                              onClick={() => {
                                addToCart(car);
                                toast.success("Đã thêm vào giỏ hàng!");
                              }}
                              disabled={car.status !== "available"}
                            >
                              Thêm vào giỏ hàng
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />

        {/* ConfirmDialog for Deletion */}
        <ConfirmDialog
          isOpen={isConfirmOpen}
          title="Xác nhận xóa xe"
          message={`Bạn có chắc chắn muốn xóa xe "${selectedCar?.name}"?`}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          confirmText="Xóa"
          cancelText="Hủy"
        />
      </div>
    </ProtectedRoute>
  );
}
