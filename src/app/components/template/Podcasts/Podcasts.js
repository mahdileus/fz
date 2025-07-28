"use client";

import { useState } from "react";
import PodcastBox from "../../modules/podcast/PodcastBox/PodcastBox";
import DurationFilterBar from "./DurationFilterBar";
import PodcastSidebar from "./PodcastSidebar";

export default function Podcasts({ podcasts }) {
  const [durationFilter, setDurationFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const allTags = Array.from(new Set(podcasts.flatMap((p) => p.tags || [])));
  const allCategories = Array.from(new Set(podcasts.map((p) => p.category).filter(Boolean)));

  const filterByAll = (podcast) => {
    const minutes = podcast.duration;

    let durationOk = true;
    switch (durationFilter) {
      case "15-30":
        durationOk = minutes >= 15 && minutes <= 30;
        break;
      case "30-45":
        durationOk = minutes > 30 && minutes <= 45;
        break;
      case "45-60":
        durationOk = minutes > 45 && minutes <= 60;
        break;
      case "60+":
        durationOk = minutes > 60;
        break;
      default:
        durationOk = true;
    }

    const searchOk = podcast.title.toLowerCase().includes(searchQuery.toLowerCase());
    const tagOk = selectedTag ? (podcast.tags || []).includes(selectedTag) : true;
    const catOk = selectedCategory ? podcast.category === selectedCategory : true;

    return durationOk && searchOk && tagOk && catOk;
  };

  return (
    <section className="w-full py-10">
      <div className="max-w-[1440px] mx-auto px-2 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
          {/* سایدبار */}
          <div className="lg:col-span-2 w-full px-6 lg:px-0">
            <PodcastSidebar
              tags={allTags}
              categories={allCategories}
              selectedTag={selectedTag}
              selectedCategory={selectedCategory}
              onSearch={setSearchQuery}
              onSelectTag={setSelectedTag}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {/* محتوای اصلی */}
          <div className="lg:col-span-8 space-y-6 w-full px-6 lg:px-0">
            <DurationFilterBar
              selected={durationFilter}
              onChange={setDurationFilter}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-9 px-6">
              {podcasts.filter(filterByAll).map((podcast) => (
                <PodcastBox key={podcast._id} podcast={podcast} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
