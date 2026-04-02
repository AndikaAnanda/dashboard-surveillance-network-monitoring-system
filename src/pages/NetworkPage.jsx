import { useState, useMemo } from "react";
import initialData from "../data/network_dataset.json"

export default function NetworkPage() {
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [siteFilter, setSiteFilter] = useState('all')

    const sites = useMemo(() => [...new Set(initialData.map(d => d.site))].sort(), [])


}