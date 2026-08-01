import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type UserStatus = "ACTIVE" | "BANNED";
export type PropertyStatus = "AVAILABLE" | "BOOKED" | "UNAVAILABLE";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";

export type IUser = {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    role: Role;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
};

export type ICategory = {
    id: string;
    name: string;
    _count?: {
        properties: number;
    };
};

export type IProperty = {
    id: string;
    landlordId: string;
    categoryId?: string | null;
    title: string;
    description?: string | null;
    location: string;
    city: string;
    price: number;
    bedrooms?: number | null;
    bathrooms?: number | null;
    areaSqft?: number | null;
    amenities: string[];
    images: string[];
    status: PropertyStatus;
    createdAt: string;
    updatedAt: string;
    landlord?: IUser;
    category?: ICategory | null;
};

export type IRentalRequest = {
    id: string;
    propertyId: string;
    tenantId: string;
    status: RequestStatus;
    message?: string | null;
    createdAt: string;
    updatedAt: string;
    property?: IProperty;
    tenant?: IUser;
    payments?: IPayment[];
};

export type IPayment = {
    id: string;
    rentalRequestId: string;
    userId: string;
    amount: number;
    method: string;
    provider: string;
    status: string;
    transactionId?: string | null;
    paidAt?: string | null;
    createdAt: string;
    updatedAt: string;
    rentalRequest?: IRentalRequest;
    user?: IUser;
};

export type IApiResponse<T = any> = {
    success: boolean;
    statusCode?: number;
    message?: string;
    data?: T;
    meta?: {
        total?: number;
        page?: number;
        limit?: number;
    };
};

export type NavbarProps = {
    user: IApiResponse<IUser>;
};

export type ISidebarItem = {
    label: string;
    href: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
};
