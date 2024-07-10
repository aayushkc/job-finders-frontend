"use client"

import { Pagination, PaginationItem } from "@mui/material";

export default function ServerPagination({ totalPages, currentPage }) {

    return (
        <div className="flex items-center gap-2">
            <Pagination
                page={parseInt(currentPage)}
                count={totalPages}
                defaultPage={1}
                // showLastButton
                // showFirstButton
                shape="rounded"
                renderItem={(item) => {
                    return (
                        <PaginationItem
                            component="a"
                            href={`/jobs-server?pageNum=${item.page}`}
                            {...item}
                        />
                    );
                }}
            />
        </div>
    )


}