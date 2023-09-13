import { useState } from "react"

export function InvitationsPage() {
    
    const [search, setSearch] = useState('');
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [page, setPage] = useState(1);

    const clearSearch = () => {
        setSearch('');
    }

    
}