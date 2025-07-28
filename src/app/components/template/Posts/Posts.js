"use client";

import { useState } from "react";
import FilterBar from "./FilterBar";
import PostsSidebar from "./PostsSidebar";
import ArticleCard from "../../modules/blogs/ArticleCard";

export default function Posts({ posts }) {
  const [sortFilter, setSortFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const allTags = Array.from(new Set(posts.flatMap((p) => p.tags || [])));
  const allCategories = Array.from(new Set(posts.map((p) => p.category).filter(Boolean)));

  const sortposts = (filteredposts) => {
    switch (sortFilter) {
      case "newest":
        return [...filteredposts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case "oldest":
        return [...filteredposts].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case "popular":
        return [...filteredposts].sort((a, b) => (b.students || 0) - (a.students || 0));
      default:
        return filteredposts;
    }
  };

  const filterposts = () => {
    return posts.filter((post) => {
      const searchOk = post.title.toLowerCase().includes(searchQuery.toLowerCase());
      const tagOk = selectedTag ? (post.tags || []).includes(selectedTag) : true;
      const catOk = selectedCategory ? post.category === selectedCategory : true;
      return searchOk && tagOk && catOk;
    });
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-2 w-full px-6 lg:px-0">
            <PostsSidebar
              tags={allTags}
              categories={allCategories}
              selectedTag={selectedTag}
              selectedCategory={selectedCategory}
              onSearch={setSearchQuery}
              onSelectTag={setSelectedTag}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* Main content */}
          <div className="lg:col-span-8 space-y-6 w-full px-6 lg:px-0">
            <FilterBar selected={sortFilter} onChange={setSortFilter} />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-9 px-6">
              {sortposts(filterposts()).map((post) => (
                <ArticleCard key={post._id} post={post} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
