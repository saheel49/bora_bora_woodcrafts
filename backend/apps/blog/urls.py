from django.urls import path
from .views import (
    BlogListView, BlogDetailView, CreateBlogPostView,
    BlogPostManageView, PublishBlogPostView, UnpublishBlogPostView,
    MyBlogPostsView,
)

urlpatterns = [
    path("",                    BlogListView.as_view()),
    path("create/",             CreateBlogPostView.as_view()),
    path("mine/",               MyBlogPostsView.as_view()),
    # Int PK routes must come before the slug route so requests like
    # /blog/123/ hit the manage view (PUT/DELETE) instead of the detail view.
    path("<int:pk>/",           BlogPostManageView.as_view()),
    path("<slug:slug>/",        BlogDetailView.as_view()),
    path("<int:pk>/publish/",   PublishBlogPostView.as_view()),
    path("<int:pk>/unpublish/", UnpublishBlogPostView.as_view()),
]
