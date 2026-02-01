interface AuthorBoxProps {
  name?: string;
  bio?: string;
  image?: string;
}

export default function AuthorBox({ 
  name = "Korea Experience Team", 
  bio = "Written by the Korea Experience editorial team - experts in Korean medical tourism, travel, and culture with years of research and firsthand experience.",
  image 
}: AuthorBoxProps) {
  return (
    <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex gap-4">
        {image && (
          <div className="flex-shrink-0">
            <img 
              src={image} 
              alt={name}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        )}
        <div>
          <h3 className="text-lg font-semibold mb-2">About the Author</h3>
          <p className="text-gray-700 font-medium mb-1">{name}</p>
          <p className="text-gray-600 text-sm">{bio}</p>
        </div>
      </div>
    </div>
  );
}
