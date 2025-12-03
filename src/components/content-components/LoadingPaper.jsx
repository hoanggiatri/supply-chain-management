import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { SkeletonText } from "@/components/common/LoadingSkeleton";

const LoadingPaper = ({ title }) => {
  return (
    <div className="p-6 animate-fade-in">
      <Card className="shadow-lg max-w-6xl mx-auto">
        <CardBody>
          {title && (
            <div className="mb-6">
              <Typography variant="h4" color="blue-gray" className="font-bold mb-2">
                {title}
              </Typography>
              <div className="h-1 w-20 bg-blue-500 rounded-full" />
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <SkeletonText lines={1} className="w-1/3" />
              <SkeletonText lines={1} className="w-full h-10" />
            </div>
            <div className="space-y-4">
              <SkeletonText lines={1} className="w-1/3" />
              <SkeletonText lines={1} className="w-full h-10" />
            </div>
            <div className="space-y-4">
              <SkeletonText lines={1} className="w-1/3" />
              <SkeletonText lines={1} className="w-full h-10" />
            </div>
            <div className="space-y-4">
              <SkeletonText lines={1} className="w-1/3" />
              <SkeletonText lines={1} className="w-full h-10" />
            </div>
          </div>

          <div className="space-y-4">
            <SkeletonText lines={1} className="w-1/4" />
            <SkeletonText lines={3} className="w-full" />
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default LoadingPaper;
