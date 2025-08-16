import { Post } from "@/app/feature/home/types";

import { Card } from "@/components/ui/card";
import { CardHeader } from "@/components/ui/card";
import { CardTitle } from "@/components/ui/card";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{post.title}</h2>
        </CardTitle>
      </CardHeader>
    </Card>
  );
};

export default PostCard;
