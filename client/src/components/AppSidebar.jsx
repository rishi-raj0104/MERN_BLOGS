import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt, BiPen } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa6";
import { LuUsers } from "react-icons/lu";
import { FiChevronRight } from "react-icons/fi";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUser,
} from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const user = useSelector((state) => state.user);
  const location = useLocation();

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "get",
      credentials: "include",
    }
  );

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { icon: IoHomeOutline, label: "Home", path: RouteIndex, show: true },
    {
      icon: GrBlog,
      label: "My Blogs",
      path: RouteBlog,
      show: user?.isLoggedIn,
    },
    {
      icon: FaRegComments,
      label: "Comments",
      path: RouteCommentDetails,
      show: user?.isLoggedIn,
    },
    {
      icon: BiCategoryAlt,
      label: "Categories",
      path: RouteCategoryDetails,
      show: user?.isLoggedIn && user.user?.role === "admin",
    },
    {
      icon: LuUsers,
      label: "Users",
      path: RouteUser,
      show: user?.isLoggedIn && user.user?.role === "admin",
    },
  ];

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="p-4 border-b border-border/50">
        <Link to={RouteIndex} className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-gradient-primary rounded-lg shadow-soft">
            <BiPen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-display font-bold text-foreground">
            BlogVerse
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2 custom-scrollbar">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarMenu>
            {menuItems.map(
              (item, index) =>
                item.show && (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton asChild>
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                          isActive(item.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
            )}
          </SidebarMenu>
        </SidebarGroup>

        {/* Categories */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {categoryData && categoryData.category?.length > 0 ? (
              categoryData.category.map((category) => (
                <SidebarMenuItem key={category._id}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={RouteBlogByCategory(category.slug)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${
                        location.pathname === RouteBlogByCategory(category.slug)
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      <span className="text-sm truncate">{category.name}</span>
                      <FiChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <div className="px-3 py-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No categories yet
                </p>
              </div>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
