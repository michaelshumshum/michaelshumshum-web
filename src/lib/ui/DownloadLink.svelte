<script lang="ts">
import Icon from "@iconify/svelte";

let { href, label }: { href: string; label: string } = $props();
</script>

<a href={href} rel="noopener noreferrer" target="_blank" download>
    <span><Icon icon="material-symbols:download"></Icon></span>
    {label}
</a>

<style>
    a {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        color: inherit;
        transition: background-color 0.2s, color 0.2s;
        border-bottom: 1px dotted currentColor;
        padding-right: 1em;
    }
    span {
        display: inline-flex;
        align-items: center;
        margin-right: 0.5rem;
    }
</style>