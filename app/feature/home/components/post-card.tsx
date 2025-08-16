import { PostsItem } from "@/app/feature/home/types";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

interface PostCardProps {
  post: PostsItem;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Link href={`/post/${post.id}`}>
      <Card className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle>
            <h2>{post.title}</h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {post.content}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PostCard;
